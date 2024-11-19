import mongoose, { Schema, Document } from 'mongoose';
import { IUserAuctionHistory } from '../interfaces/model/IAuctionHistory';


const UserAuctionHistorySchema: Schema = new Schema({
  userId: { type: String, required: true },
  auctionId: { type: String, required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['win', 'failed', 'canceled'], 
    required: true 
  },
  bidAmount: { type: Number }, 
  actionDate: { type: Date, required: true },
}, { timestamps: true });

const UserAuctionHistory = mongoose.model<IUserAuctionHistory>('UserAuctionHistory', UserAuctionHistorySchema);

export { UserAuctionHistory, IUserAuctionHistory };
