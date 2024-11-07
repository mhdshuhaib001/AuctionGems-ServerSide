import mongoose from "mongoose";

export interface ISellerRevenue extends Document {
    orderId: mongoose.Types.ObjectId; 
    productId: mongoose.Types.ObjectId; 
    sellerId: mongoose.Types.ObjectId;
    sellerEarnings: number;
    platformFee: number;
  
}
