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
      // Fetch the auction details to get the current highest bid
      const auction = await this._auctionRepository.getAuctionItem(auctionId);

      if (!auction) {
        throw new Error("Auction not found");
      }

      // Check if the new bid is greater than the current highest bid
      console.log(bidAmount, auction.currentBid, "befor check the bid amount ");
      if (bidAmount <= auction.currentBid) {
        throw new Error("Bid amount must be higher than the current bid");
      }

      // Call the repository method to place the bid
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

      // Update the auction with the new highest bid
      await this._auctionRepository.updateAuctionBid(auctionId, bidAmount);
    } catch (error) {
      console.error("Error placing bid:", error);
      throw error;
    }
  }

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

          console.log(bid);
          return {
            id: bid._id,
            bidder: userData.name,
            amount: bid.currentBid,
            time: bid.time,
            avatar: userData.profileImage || "default-avatar-url"
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




  async endAuctionAndNotifyWinner(
    auctionId: string
  ): Promise<{
    winnerId: string;
    paymentLink: string;
    productName: string;
    image: string;
    currentBid: number;
  }> {
    try {

      const auctionItem =
        await this._auctionRepository.getAuctionItem(auctionId);
      if (!auctionItem) {
        console.error("Auction not found");
        throw new Error("Auction not found");
      }
      console.log(`Auction item found: ${auctionItem.itemTitle}-------------------------------`);
      const currentTime = new Date();
      const endTime = new Date(auctionItem.auctionEndDateTime);
      
      if (currentTime < endTime) {
        console.log(`Auction ${auctionId} hasn't ended yet. Current: ${currentTime}, End: ${endTime}`);
throw new Error('auction is not ended')
      }
      // const currentTime = new Date();
      // if (currentTime < auctionItem.auctionEndDateTime) {
      //   console.log("Auction is still running...");
      //   throw new Error("Auction is still running");
      // }

      const bids = await this._auctionRepository.getBiddings(auctionId);
      if (!bids || bids.length === 0) {
        // console.log("No bids placed for this auction.");
        await ProductModel.findByIdAndUpdate(auctionId, {
          sold: false,
          auctionStatus: "unsold"
        });
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
      // console.log(
      //   `Highest bid: ${highestBid.currentBid} by user: ${highestBid.buyerID}`
      // );

      const winner = await this._userRepository.findById(
        highestBid.buyerID.toString()
      );
      if (!winner || !winner._id) {
        console.error("Winner not found or missing ID");
        throw new Error("Winner not found or missing ID");
      }
      console.log(`Winner found: ${winner.email}`);

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
      } else {
        console.error("Failed to send winner email.");
      }

      await ProductModel.findByIdAndUpdate(auctionId, {
        sold: true,
        finalBidAmount: highestBid.currentBid,
        auctionStatus: "sold"
      });

      await this._auctionRepository.updateAuctionStatus(auctionId, "sold");


      console.log(
        `Product marked as sold for auctionId: ${auctionId}, final bid amount: ${highestBid.currentBid}`
      );

      const io = getSocketInstance();
      io.to(auctionId).emit("auction_winner", {
        auctionId,
        winnerId: winner._id.toString(),
        winningBid: highestBid.currentBid,
        productTitle: auctionItem.itemTitle,
        productImage: auctionItem.images[0],
        checkoutLink: paymentLink
      });

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

  async getAllActiveAuctions(): Promise<any[]> {
    try {
      const currentTime = new Date().toISOString();
      const currentTimeInIST = new Date(Date.now() + 5.5 * 60 * 60 * 1000).toISOString();
      console.log(currentTime, "this is the current time ");
      const activeAuctions =
        await this._auctionRepository.getActiveAuctions(currentTimeInIST);

      return activeAuctions;
    } catch (error) {
      console.error("Error fetching active auctions:", error);
      throw error;
    }
  }
}

export default AuctionUseCase;
