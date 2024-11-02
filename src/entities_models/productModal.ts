import { Product } from "../interfaces/model/seller";
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller' },
    itemTitle: { type: String, required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    description: String,
    condition: { type: String, required: true },
    images: [String],
    auctionFormat: { type: String, required: true, enum: ['buy-it-now', 'auction'] },
    auctionStartDateTime: { type: String},
    auctionEndDateTime: { type: String },
    reservePrice: { type: Number, required: true },
    shippingType: { type: String, required: true, enum: ['standard', 'express'] },
    shippingCost: Number,
    handlingTime: String,
    item_location: String,
    zip_code: String,
    city: String,
    state: String,
    returnPolicy: {type: String},
    sold: { type: Boolean, default: false },             
    finalBidAmount: { type: Number, default: null },       
    auctionStatus: { 
        type: String,
        enum: ['live', 'upcoming', 'ended', 'sold'], 
        default: 'upcoming' 
    },
    currentBid:{type:Number}
});

export const ProductModel = mongoose.model<Product>("Product", ProductSchema);
export default ProductModel;
