import { Document } from "mongoose";
export interface IUserAuctionHistory extends Document {
    userId: string; 
    auctionId: string; 
    productName: string;
    amount: number;
    status: 'win' | 'failed' | 'canceled';
    bidAmount?: number;
    actionDate: Date; 
  }