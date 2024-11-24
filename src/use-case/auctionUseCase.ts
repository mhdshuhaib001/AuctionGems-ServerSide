import { log } from "console";
import AuctionRepository from "../infrastructure/repositories/AuctionRepository";
import UserRepository from "../infrastructure/repositories/UserRepositories";
import IAuctionUseCase from "../interfaces/iUseCases/iAuctionUseCase";
import NodeMailer from "../providers/nodeMailer";
import { getSocketInstance } from "../infrastructure/config/services/socket-io";
import ProductModel from "../entities_models/productModal";
import NotificationSubscriptionModel from "../entities_models/Notification";
import { sendAuctionAlert } from "../infrastructure/config/services/fireBaseConfig";
import { whatsAppNotification } from "../infrastructure/config/services/twilioWhatsappNotification";
import AdminRepository from "../infrastructure/repositories/AdminRepository";
import { IUserAuctionHistory } from "../entities_models/auctionHistory";
require("dotenv").config();

interface BidTypes {
  auctionId: string;
  bidderId: string;
  sellerId?: string;
  bidAmount: Number;
  currentBid: Number;
  time: Date;
}

class AuctionUseCase implements IAuctionUseCase {
  constructor(
    private readonly _auctionRepository: AuctionRepository,
    private readonly _userRepository: UserRepository,
    private readonly _mailer: NodeMailer,
    private readonly _adminRepository: AdminRepository
  ) {}

  async placeBid(bid: BidTypes): Promise<void> {
    try {
      const { auctionId, bidderId, currentBid, bidAmount, sellerId, time } =
        bid;
      console.log(bid);
      const auction = await this._auctionRepository.getAuctionItem(auctionId);

      if (!auction) {
        throw new Error("Auction not found");
      }

      console.log(bidAmount, auction.currentBid, "befor check the bid amount ");
      if (bidAmount <= auction.currentBid) {
        throw new Error("Bid amount must be higher than the current bid");
      }

      const result = await this._auctionRepository.placeBid(
        bidderId,
        auctionId,
        sellerId || "",
        bidAmount,
        currentBid
      );

      if (!result) {
        throw new Error("Failed to place bid in the database");
      }

      await this._auctionRepository.updateAuctionBid(auctionId, bidAmount);
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  }

  // fetch alll the bids

  async fetchBidders(auctionId: string): Promise<any[]> {
    try {
      const bids = await this._auctionRepository.getBiddings(auctionId);

      const sortedBids = bids.sort((a, b) => b.currentBid - a.currentBid);

      const topBids = sortedBids.slice(0, 5);

      const biddersData = await Promise.all(
        topBids.map(async (bid) => {
          const userData = await this._userRepository.findById(
            bid.buyerID.toString()
          );

          if (!userData) {
            return null;
          }

          return {
            id: bid._id,
            bidder: userData.name,
            amount: bid.currentBid,
            time: bid.time,
            avatar: userData.profileImage
          };
        })
      );

      const filteredBiddersData = biddersData.filter((bid) => bid !== null);

      return filteredBiddersData;
    } catch (error) {
      console.error("Error fetching bidders:", error);
      throw error;
    }
  }

  // to check the winner on aftr the auction end
  async endAuctionAndNotifyWinner(auctionId: string): Promise<{
    winnerId: string;
    paymentLink: string;
    productName: string;
    image: string;
    currentBid: number;
  }> {
    try {
      console.log(`Ending auction for auctionId: ${auctionId}`);

      const auctionItem =
        await this._auctionRepository.getAuctionItem(auctionId);
      if (!auctionItem) {
        console.error("Auction not found");
        throw new Error("Auction not found");
      }

      const currentTime = new Date();
      const endTime = new Date(auctionItem.auctionEndDateTime);
      console.log(`Current time: ${currentTime}, End time: ${endTime}`);

      if (currentTime < endTime) {
        console.log(
          `Auction ${auctionId} hasn't ended yet. Current: ${currentTime}, End: ${endTime}`
        );
        throw new Error("auction is not ended");
      }

      const bids = await this._auctionRepository.getBiddings(auctionId);

      if (!bids || bids.length === 0) {
        await ProductModel.findByIdAndUpdate(auctionId, {
          sold: false,
          auctionStatus: "unsold"
        });
        console.log(
          `No bids found for auction ${auctionId}. Marked as unsold.`
        );
        return {
          winnerId: "",
          paymentLink: "",
          productName: "",
          image: "",
          currentBid: 0
        };
      }

      const sortedBids = bids.sort(
        (a, b) =>
          b.currentBid - a.currentBid ||
          new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      const highestBid = sortedBids[0];
      console.log(`Highest bid: ${JSON.stringify(highestBid)}`);

      const winner = await this._userRepository.findById(
        highestBid.buyerID.toString()
      );
      if (!winner || !winner._id) {
        throw new Error("Winner not found or missing ID");
      }

      const productName = auctionItem.itemTitle;
      const paymentLink = `${process.env.FRONTEND_URL}/checkout/${auctionId}`;
      const emailSent = await this._mailer.sendWinnerMail(
        winner.email,
        productName,
        highestBid.currentBid,
        paymentLink,
        auctionItem.images[0]
      );
      if (emailSent) {
        console.log("Winner email sent successfully.");
      }

      await ProductModel.findByIdAndUpdate(auctionId, {
        sold: true,
        finalBidAmount: highestBid.currentBid,
        auctionStatus: "sold"
      });

      await this._auctionRepository.updateAuctionStatus(auctionId, "sold");

      const io = getSocketInstance();
      io.to(auctionId).emit("auction_winner", {
        auctionId,
        winnerId: winner._id.toString(),
        winningBid: highestBid.currentBid,
        productTitle: auctionItem.itemTitle,
        productImage: auctionItem.images[0],
        checkoutLink: paymentLink
      });

      io.emit("new_order_notification", {
        id: Date.now().toString(),
        sellerId: auctionItem.sellerId,
        orderId: auctionItem._id,
        productName: auctionItem.itemTitle,
        buyerId: auctionItem.sellerId,
        price: auctionItem.currentBid,
        timestamp: new Date().toISOString(),
        isRead: false
      });
      console.log(
        `Auction ${auctionId} ended. Winner ID: ${winner._id.toString()}`
      );

      return {
        winnerId: winner._id.toString(),
        paymentLink,
        productName,
        image: auctionItem.images[0],
        currentBid: highestBid.currentBid
      };
    } catch (error) {
      console.error("Error ending auction or notifying winner:", error);
      throw error;
    }
  }

  async relistAuction(auctionId: string): Promise<void> {
    try {
      const auction = await this._auctionRepository.getAuctionItems(auctionId);
      if (!auction) {
        throw new Error("Auction not found");
      }

      if (
        auction.auctionStatus === "sold" &&
        auction.paymentStatus === "pending"
      ) {
        await this._auctionRepository.updateAuctionStatus(
          auctionId,
          "relisted"
        );
        await this._auctionRepository.resetAuctionBids(auctionId);
        console.log(`Auction ${auctionId} has been relisted.`);
      } else {
        console.log(
          `Auction ${auctionId} cannot be relisted because payment was not pending.`
        );
      }
    } catch (error) {
      console.error("Error relisting auction:", error);
      throw error;
    }
  }

  async getAllActiveAuctions(): Promise<any[]> {
    try {
      const currentTimeInIST = new Date(
        Date.now() + 5.5 * 60 * 60 * 1000
      ).toISOString();
      const activeAuctions =
        await this._auctionRepository.getActiveAuctions(currentTimeInIST);
      return activeAuctions;
    } catch (error) {
      console.error("Error fetching active auctions:", error);
      throw error;
    }
  }
  async getAwaitPayment(): Promise<any> {
    try {
      const AwaitPayment =
        await this._auctionRepository.getAuctionAwaitPayment();
      return AwaitPayment;
    } catch (error) {
      console.error("Error fetching active auctions:", error);
      throw error;
    }
  }

  async createAuctionHistory(
    data: Partial<IUserAuctionHistory>
  ): Promise<IUserAuctionHistory> {
    if (
      !data.userId ||
      !data.auctionId ||
      !data.productName ||
      !data.amount ||
      !data.status ||
      !data.actionDate
    ) {
      throw new Error("All required fields must be provided.");
    }
    return await this._auctionRepository.createAuctionHistory(data);
  }
}

export default AuctionUseCase;
