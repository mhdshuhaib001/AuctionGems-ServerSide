import { Product } from "../interfaces/model/seller";
import mongoose from "mongoose";
const ProductSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller' },
    itemTitle: { type: String, required: true },
    categoryId: { type: String, required: true },
    description: String,
    condition: { type: String, required: true },
    images: [String],
    auctionFormat: { type: String, required: true, enum: ['buy-it-now', 'auction'] },
    auctionStartDateTime: { type: String, required: true },
    auctionEndDateTime: { type: String, required: true },
    reservePrice: { type: Number, required: true },
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
export default ProductModel;
