import mongoose, { Schema, Document, Model, model } from "mongoose";
import { Seller } from "../interfaces/model/seller";
import { Product } from "../interfaces/model/seller";

// Seller schema
const sellerSchema = new Schema<Seller>({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    companyName: {
      type: String,
      required: true,
    },
    contactInfo: {
      type: String,
    },
    about: {
      type: String,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
    profile: {
      type: String,
    },
  });
  
  // Create the Seller model
  const SellerModel: Model<Seller> = model<Seller>('Seller', sellerSchema);


const ProductSchema = new mongoose.Schema({
    sellerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller' },
    itemTitle: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    condition: { type: String, required: true },
    images: [String],
    auctionFormat: { type: String, required: true, enum: ['buy-it-now', 'auction'] },
    auctionStartDateTime: String,
    auctionEndDateTime: String,
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
