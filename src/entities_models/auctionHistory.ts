import mongoose, { Schema, Document } from 'mongoose';

interface IUserAuctionHistory extends Document {
  userId: string; 
  auctionId: string; 
  productName: string;
  amount: number;
  status: 'attended' | 'failed' | 'canceled';
  bidAmount?: number;
  actionDate: Date; 
}

// auction History scema 
const UserAuctionHistorySchema: Schema = new Schema({
  userId: { type: String, required: true },
  auctionId: { type: String, required: true },
  productName: { type: String, required: true },
  amount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['attended', 'failed', 'canceled'], 
    required: true 
  },
  bidAmount: { type: Number }, 
  actionDate: { type: Date, required: true },
}, { timestamps: true });

const UserAuctionHistory = mongoose.model<IUserAuctionHistory>('UserAuctionHistory', UserAuctionHistorySchema);

export { UserAuctionHistory, IUserAuctionHistory };
