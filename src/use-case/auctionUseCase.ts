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
      const { auctionId, bidderId, currentBid, bidAmount, sellerId, time } = bid;
  
      // Fetch the auction details to get the current highest bid
      const auction = await this._auctionRepository.getAuctionItem(auctionId);
      
      if (!auction) {
        throw new Error("Auction not found");
      }
  
      // Check if the new bid is greater than the current highest bid
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

  // async endAuctionAndNotifyWinner(auctionId: string): Promise<void> {
  //   try {
  //     const auctionItem = await this._auctionRepository.getAuctionItem(auctionId);
  //     if (!auctionItem) {
  //       throw new Error("Auction not found");
  //     }
  
  //     const currentTime = new Date();
  //     if (currentTime < auctionItem.auctionEndDateTime) {
  //       console.log("Auction is still running...");
  //       return;
  //     }
  
  //     const bids = await this._auctionRepository.getBiddings(auctionId);
  //     if (!bids || bids.length === 0) {
  //       console.log("No bids placed for this auction.");
  //       return;
  //     }
  
  //     const sortedBids = bids.sort((a, b) => b.currentBid - a.currentBid || new Date(b.time).getTime() - new Date(a.time).getTime());
  //     const highestBid = sortedBids[0];
  //     const winner = await this._userRepository.findById(highestBid.buyerID.toString());
  //     if (!winner) {
  //       throw new Error("Winner not found");
  //     }
  // if(!winner._id){
  //   throw new Error("winner Id not found")
  // }
  //     const subscription = await this._adminRepository.getNotificationSubscription(auctionId, winner._id.toString());
  //     if (!subscription) {
  //       console.log("No notification subscription found for winner.");
  //       return;
  //     }
  
  //     const { fcmToken, whatsappNumber } = subscription;
  //     const productName = auctionItem.itemTitle;
  //     const paymentLink = `${process.env.FRONTEND_URL}/checkout/${auctionId}`;
  //     const message = `Congratulations! You won the auction for "${productName}" with a bid of ${highestBid.currentBid}.`;
  
  //     // if (fcmToken) await sendAuctionAlert(fcmToken, message, auctionItem.images[0], paymentLink);
  //     // if (whatsappNumber) await whatsAppNotification(whatsappNumber, message, auctionItem.images[0]);
  
  //     const emailSent = await this._mailer.sendWinnerMail(winner.email, productName, highestBid.currentBid, paymentLink, auctionItem.images[0]);
  //     if (emailSent) console.log("Winner email sent successfully.");
  
  //     await ProductModel.findByIdAndUpdate(auctionId, { sold: true, finalBidAmount: highestBid.currentBid });
  
  //     const io = getSocketInstance();
  //     if (winner?._id) io.to(auctionId).emit("auctionEnded", { winner: winner._id.toString(), amount: highestBid.currentBid });
  //   } catch (error) {
  //     console.error("Error ending auction or notifying winner:", error);
  //     throw error;
  //   }
  // }
  
  async endAuctionAndNotifyWinner(auctionId: string): Promise<{ winnerId: string; paymentLink: string; productName: string; image: string; currentBid: number }> {
    try {
      console.log(`Ending auction for auctionId: ${auctionId}`);
      
      // Fetch the auction item
      const auctionItem = await this._auctionRepository.getAuctionItem(auctionId);
      if (!auctionItem) {
        console.error("Auction not found");
        throw new Error("Auction not found");
      }
      console.log(`Auction item found: ${auctionItem.itemTitle}`);
  
      // Check if the auction has ended
      const currentTime = new Date();
      if (currentTime < auctionItem.auctionEndDateTime) {
        console.log("Auction is still running...");
        throw new Error("Auction is still running"); 
      }
      console.log("Auction has ended, proceeding to determine the winner...");
  
      // Fetch the bids placed on the auction item
      const bids = await this._auctionRepository.getBiddings(auctionId);
      console.log(`Bids fetched: ${bids.length}`);
      if (!bids || bids.length === 0) {
        console.log("No bids placed for this auction.");
        // Optionally, you can mark the auction as unsold
        await ProductModel.findByIdAndUpdate(auctionId, { sold: false });
        console.log(`Auction marked as unsold for auctionId: ${auctionId}`);
        // Return a default or placeholder value to match the expected return type
        return {
          winnerId: "",
          paymentLink: "",
          productName: "",
          image: "",
          currentBid: 0
        };
      }
  
      // Sort bids to find the highest one
      const sortedBids = bids.sort((a, b) => {
        return b.currentBid - a.currentBid || new Date(b.time).getTime() - new Date(a.time).getTime();
      });
      const highestBid = sortedBids[0];
      console.log(`Highest bid found: ${highestBid.currentBid} by user: ${highestBid.buyerID}`);
  
      // Find the winner based on the highest bid
      const winner = await this._userRepository.findById(highestBid.buyerID.toString());
      if (!winner) {
        console.error("Winner not found");
        throw new Error("Winner not found");
      }
  
      // Ensure the winner has a valid ID
      if (!winner._id) {
        console.error("Winner ID not found");
        throw new Error("Winner ID not found");
      }
      console.log(`Winner found: ${winner.email}`);
  
      // // Fetch notification subscription for the winner
      // const subscription = await this._adminRepository.getNotificationSubscription(auctionId, winner._id.toString());
      // if (!subscription) {
      //   console.log("No notification subscription found for winner.");
      //   throw new Error("No notification subscription found for winner."); // or handle it as needed
      // }
  
      // const { fcmToken, whatsappNumber } = subscription;
      const productName = auctionItem.itemTitle;
      const paymentLink = `${process.env.FRONTEND_URL}/checkout/${auctionId}`;
      const message = `Congratulations! You won the auction for "${productName}" with a bid of ${highestBid.currentBid}.`;
  
      // Send notifications (uncomment these lines if you have implemented these functions)
      // if (fcmToken) await sendAuctionAlert(fcmToken, message, auctionItem.images[0], paymentLink);
      // if (whatsappNumber) await whatsAppNotification(whatsappNumber, message, auctionItem.images[0]);
  
      // Send an email to the winner
      const emailSent = await this._mailer.sendWinnerMail(winner.email, productName, highestBid.currentBid, paymentLink, auctionItem.images[0]);
      if (emailSent) {
        console.log("Winner email sent successfully.");
      } else {
        console.error("Failed to send winner email.");
      }
  
      // Mark the product as sold and update the final bid amount
      await ProductModel.findByIdAndUpdate(auctionId, { sold: true, finalBidAmount: highestBid.currentBid });
      console.log(`Product marked as sold for auctionId: ${auctionId}, final bid amount: ${highestBid.currentBid}`);
  
      const io = getSocketInstance();
      io.to(auctionId).emit('auction_winner', {
        auctionId,
        winnerId: winner._id.toString(),
        winningBid: highestBid.currentBid ,
        productTitle: auctionItem.itemTitle,
        productImage: auctionItem.images[0],
        checkoutLink: `${process.env.FRONTEND_URL}/checkout/${auctionId}`
      });

      // Return winner details for frontend
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
      // const currentTime = new Date();
      const currentTime = new Date("2024-10-23T04:01:00Z");

      const activeAuctions =
        await this._auctionRepository.getActiveAuctions(currentTime);

      return activeAuctions;
    } catch (error) {
      console.error("Error fetching active auctions:", error);
      throw error;
    }
  }
}

export default AuctionUseCase;
