import mongoose, { Document, Schema } from 'mongoose';
import { ISellerRevenue } from '../interfaces/model/ISellerRevenue';


const sellerRevenueSchema = new Schema<ISellerRevenue>(
    {
        orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        sellerId: { type: Schema.Types.ObjectId, ref: 'Seller', required: true },
        sellerEarnings: { type: Number, required: true },
        platformFee: { type: Number },
    },
    {
        timestamps: true, 
    }
);

const SellerRevenue = mongoose.model<ISellerRevenue>('SellerRevenue', sellerRevenueSchema);

export default SellerRevenue;
