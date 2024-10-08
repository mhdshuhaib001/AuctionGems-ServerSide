import mongoose, { Document, ObjectId, Types } from "mongoose";

export interface Seller extends Document {
    email: string;
    profile?: string; 
    _id: string;
    userId: Types.ObjectId; 
    companyName: string;
    contactInfo?: string;
    about?: string; 
    isBlocked?: boolean;
}

export interface Product {
    _id: any;
    SellerId: mongoose.Types.ObjectId;
    item_title: string;
    itemTitle?: string;
    category: string;
    description?: string;
    condition: 'new' | 'used' | 'vintage';
    images?: string[];
    auction_format: 'buy-it-now' | 'auction';
    auction_start_time?: Date;
    auction_end_time?: Date;
    reservePrice?: string;
    shipping_type: 'standard' | 'express';
    shipping_cost?: number;
    handling_time?: number;
    item_location?: string;
    zip_code?: string;
    city?: string;
    state?: string;
    return_duration?: number; 
}


export interface SellerResponse{
    status: number;
     message: string;
     productData?: Product 
}
  