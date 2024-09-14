import mongoose, { Schema, Document, Model } from "mongoose";
import { Seller } from "../interfaces/model/seller";
import { Product } from "../interfaces/model/seller";

// Seller schema
const sellerSchema = new Schema<Seller>({
    UserID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    CompanyName: {
        type: String,
        required: true,
    },
    ContactInfo: {
        type: String,
    },
    About: {
        type: String,
    },
    IsBlocked: {
        type: Boolean,
        default: false,
    },
});

const SellerModel: Model<Seller> = mongoose.model<Seller>("Seller", sellerSchema);

const ProductSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
    itemTitle: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    condition: { type: String, required: true },
    images: [String],
    auctionFormat: { type: String, required: true, enum: ['buy-it-now', 'auction'] },
    auction_start_time: Date,
    auction_end_time: Date,
    reservePrice: Number,
    shippingType: { type: String, required: true, enum: ['standard', 'express'] },
    shippingCost: Number,
    handlingTime: String,
    item_location: String,
    zip_code: String,
    city: String,
    state: String,
    return_duration: Number,
});


export const ProductModel = mongoose.model<Product>("Product", ProductSchema);
export default SellerModel;
