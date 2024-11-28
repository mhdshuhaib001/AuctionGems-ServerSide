import { Document } from "mongoose";
export interface IUserAuctionHistory {
  userId: string;
  auctionId: string;
  productName: string;
  amount: number;
  actionDate?:Date
  status: "win" | "failed" | "canceled";
  bidAmount?: number;
  productDetails: {
    image: string;
    itemTitle: string;
  } | null;
}
