import mongoose, { Document, ObjectId, Types } from "mongoose";

export interface Seller extends Document {
    email: string;
    profile?: string; 
    _id: string;
    userId: Types.ObjectId; 
    companyName: string;
    phone?: string;
    about?: string; 
    isBlocked?: boolean;
    address?: string;
}

export interface Product extends Document {
    category:string;
    sellerId: mongoose.Types.ObjectId;
    itemTitle: string;
    categoryId: string; 
    description?: string;
    condition: 'new' | 'used' | 'vintage';
    images?: string[];
    auctionFormat: 'buy-it-now' | 'auction';
    auctionStartDateTime: string; 
    auctionEndDateTime?: Date;
    reservePrice?: string;
    shippingType: 'standard' | 'express';
    shippingCost?: number;
    handlingTime?: number;
    itemLocation?: string;
    zipCode?: string;
    city?: string;
    state?: string;
    returnDuration?: number; 
  }
  


export interface SellerResponse{
    status: number;
     message: string;
     productData?: Product 
}
  