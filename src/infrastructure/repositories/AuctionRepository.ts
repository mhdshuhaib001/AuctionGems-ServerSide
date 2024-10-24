import { IAuctionRepository } from "../../interfaces/iRepositories/iAuctionRepository";
import bidModel from '../../entities_models/bidModel';
import mongoose from "mongoose";
import ProductModel from "../../entities_models/productModal";
import { Product } from "../../interfaces/model/seller";
class AuctionRepository implements IAuctionRepository {
    async placeBid(bidderId: string, auctionId: string, sellerId: string, currentBid: Number,bidAmount:Number): Promise<any | null> {
        try {
            const newBid = new bidModel({
                auctionId,
                buyerID: bidderId,
                sellerID: sellerId,
                currentBid: currentBid, 
                bidStatus: 'Active',
            });

            const savedBid = await newBid.save();
            return savedBid;
        } catch (error) {
            console.error('Error placing bid:', error);
            return null; 
        }
    }

    async getBiddings(auctionId:string):Promise<any[]>{
        try {
            console.log(`Fetching bids for auction ID: ${auctionId}`); 
            const objectId = new mongoose.Types.ObjectId(auctionId);

            const bidders = await bidModel.find({ auctionId: objectId }).exec();
            console.log(bidders,'halooooooo')
            return bidders
        } catch (error) {
            console.error('Error placing fetching bids:', error);
            return [];        }
    }

    async getAuctionItem(id: string): Promise<Product> {
        try {
            const auctionItem = await ProductModel.findOne({ _id: id });
            if (!auctionItem) {
                throw new Error('Auction item not found');
            }
            return auctionItem;
        } catch (error) {
            console.error('Error finding auction item:', error);
            throw error;
        }
    }

    async getActiveAuctions(currentTime: Date): Promise<any[]> {
        try {

            console.log('this is the auctoion pende')
          const activeAuctions = await ProductModel.find();

          return activeAuctions;
        } catch (error) {
          console.error('Error fetching active auctions:', error);
          throw error;
        }
      }
    
}

export default AuctionRepository;
