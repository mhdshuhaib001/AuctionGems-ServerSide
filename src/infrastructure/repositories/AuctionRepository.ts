import { IAuctionRepository } from "../../interfaces/iRepositories/iAuctionRepository";
import bidModel from "../../entities_models/bidModel";
import mongoose from "mongoose";
import ProductModel from "../../entities_models/productModal";
import { Product } from "../../interfaces/model/seller";
import OrderModel from "../../entities_models/orderModel";
import {
  IUserAuctionHistory,
  UserAuctionHistory
} from "../../entities_models/auctionHistory";

class AuctionRepository implements IAuctionRepository {
  async placeBid(
    bidderId: string,
    auctionId: string,
    sellerId: string,
    currentBid: Number,
    bidAmount: Number
  ): Promise<any | null> {
    try {
      const newBid = new bidModel({
        auctionId,
        buyerID: bidderId,
        sellerID: sellerId,
        currentBid: currentBid,
        bidStatus: "Active"
      });
// final bid amount and bid saving area

      const savedBid = await newBid.save();
      return savedBid;
    } catch (error) {
      console.error("Error placing bid:", error);
      return null;
    }
  }

  async updateAuctionBid(auctionId: string, newBid: Number): Promise<void> {
    const auction = await ProductModel.findById(auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }

    auction.currentBid = newBid;
    await auction.save();
  }
  async updateAuctionStatus(auctionId: string, status: string): Promise<void> {
    const auction = await ProductModel.findById(auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }

    if (
      status !== "sold" &&
      status !== "live" &&
      status !== "upcoming" &&
      status !== "relisted" &&
      status !== "end" &&
      status !== "unsold"
    ) {
      throw new Error("Invalid auction status");
    }

    auction.auctionStatus = status;
    await auction.save();
  }

  async getBiddings(auctionId: string): Promise<any[]> {
    try {
      const objectId = new mongoose.Types.ObjectId(auctionId);

      const bidders = await bidModel.find({ auctionId: objectId }).exec();
      return bidders;
    } catch (error) {
      console.error("Error placing fetching bids:", error);
      return [];
    }
  }

  async getAuctionItem(id: string): Promise<Product> {
    try {
      const auctionItem = await ProductModel.findOne({ _id: id });
      if (!auctionItem) {
        throw new Error("Auction item not found");
      }
      return auctionItem;
    } catch (error) {
      console.error("Error finding auction item:", error);
      throw error;
    }
  }
  async getActiveAuctions(currentTimeInIST: any): Promise<any[]> {
    try {
      const activeAuctions = await ProductModel.find({
        auctionStatus: { $ne: "sold" },
        auctionFormat: { $ne: "buy-it-now" },
        auctionEndDateTime: { $lte: currentTimeInIST }
      });

      return activeAuctions;
    } catch (error) {
      console.error("Error fetching active auctions:", error);
      throw error;
    }
  }

  async getAuctionAwaitPayment() {
    try {
      return await OrderModel.find({
        status: "sold",
        paymentStatus: "pending",
        paymentDueDate: { $lt: new Date() }
      });
    } catch (error) {
      console.error("Error fetching await auctionPaymen:", error);
      throw error;
    }
  }
  async findById(auctionId: string): Promise<any> {
    try {
      return await OrderModel.findOne({ productId: auctionId });
    } catch (error) {
      console.error("Error fetching await findById:", error);
      throw error;
    }
  }

  async resetAuctionBids(auctionId: string): Promise<void> {
    try {
      const auction = await ProductModel.findById(auctionId);
      if (!auction) {
        throw new Error("Auction not found");
      }

      auction.currentBid = 0;
      auction.auctionStatus = "upcoming";
      await auction.save();

      await bidModel.deleteMany({ auctionId: auction._id });
    } catch (error) {
      console.error("Error resetting auction bids:", error);
      throw error;
    }
  }

  async getAuctionItems(id: string): Promise<any> {
    try {
      const auctionItems = await ProductModel.findById(id).exec();
      if (!auctionItems) {
        console.error("Auction item not found");
        return null;
      }

      const auctionItem = await OrderModel.findOne({
        productId: auctionItems._id
      }).exec();

      return auctionItem;
    } catch (error) {
      console.error("Error finding auction item:", error);
      throw new Error("Error fetching auction item");
    }
  }

  async getAuctionsAwaitingPayment(): Promise<any[]> {
    try {
      const twoDaysAgo = new Date();
      twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
      const orders = await OrderModel.find({
        paymentStatus: "pending",
        paymentDueDate: { $lt: twoDaysAgo },
        orderStatus: { $ne: "completed" }
      }).populate("productId");

      const auctions = orders.map((order) => order.productId);
      return auctions;
    } catch (error) {
      console.error("Error fetching auctions awaiting payment:", error);
      throw error;
    }
  }

  async createAuctionHistory(
    data: Partial<IUserAuctionHistory>
  ): Promise<IUserAuctionHistory> {
    try {
      const history = new UserAuctionHistory(data);
      return await history.save();
    } catch (error) {
      console.error("Error adding auction history:", error);
      throw error;
    }
  }

  async findByUserIdHistory(userId: string): Promise<IUserAuctionHistory[]> {
    try {
      return await UserAuctionHistory.find({ userId }).exec();
    } catch (error) {
      console.error("Error get auction history:", error);
      throw error;
    }
  }
}

export default AuctionRepository;
