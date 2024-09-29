import mongoose, { Document, ObjectId, Types } from "mongoose";

export interface Seller extends Document {
    email: string;
    profile?: string; // Updated to camelCase
    _id: string;
    userId: Types.ObjectId; // Updated to camelCase
    companyName: string; // Updated to camelCase
    contactInfo?: string; // Updated to camelCase
    about?: string; // Updated to camelCase
    isBlocked?: boolean; // Updated to camelCase
}

export interface Product {
    SellerId: mongoose.Types.ObjectId;
    item_title: string;
    category: string;
    description?: string;
    condition: 'new' | 'used' | 'vintage';
    images?: string[];
    auction_format: 'buy-it-now' | 'auction';
    auction_start_time?: Date;
    auction_end_time?: Date;
    reserve_price?: number;
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
  