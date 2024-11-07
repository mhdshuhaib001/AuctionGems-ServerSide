import mongoose, { Schema } from "mongoose";

import { IReview } from "../interfaces/model/IReview";

const ReviewSchema: Schema<IReview> = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Seller', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now },
  }, { timestamps: true });
  
  export default mongoose.model<IReview>('Review', ReviewSchema);
  