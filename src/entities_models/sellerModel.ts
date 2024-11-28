import mongoose, { Schema, Model, model } from "mongoose";
import { Seller } from "../interfaces/model/seller";

// Seller schema
const sellerSchema = new Schema<Seller>({
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    address: {
      type: String,
    },
    companyName: {
      type: String,
      required: true,
    },
    phone: {
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
  }, { timestamps: true });
  
  const SellerModel: Model<Seller> = model<Seller>('Seller', sellerSchema);

  export default SellerModel;
