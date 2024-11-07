import mongoose, { Document, ObjectId, Types } from "mongoose";
import { User } from "./user";

export interface Seller extends Document {
  email: string;
  profile?: string;
  _id: string;
  userId: User;
  companyName: string;
  phone?: string;
  about?: string;
  isBlocked?: boolean;
  address?: string;
}

export interface Product extends Document {
  name: any;
  category?: string;
  sellerId: Seller;
  itemTitle: string;
  categoryId: mongoose.Types.ObjectId;
  categoryName?: string;
  description?: string;
  condition: "new" | "used" | "vintage";
  images: string[];
  auctionFormat: "buy-it-now" | "auction";
  auctionStartDateTime: string;
  auctionEndDateTime: Date;
  reservePrice?: string;
  auctionStatus: "live" | "upcoming" | "end" | "sold" | "unsold";
  shippingType: "standard" | "express";
  shippingCost?: number;
  handlingTime?: number;
  itemLocation?: string;
  zipCode?: string;
  city?: string;
  currentBid: Number;
  state?: string;
  returnDuration?: number;
}

export interface SellerResponse {
  status: number;
  message: string;
  productData?: Product;
  seller?: Seller[];
}
