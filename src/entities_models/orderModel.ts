import mongoose, { Schema } from 'mongoose';
import IOrder from '../interfaces/model/order';

const OrderSchema: Schema<IOrder> = new Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Product' },
    buyerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' }, 
    sellerId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Seller' },
    orderDate: { type: Date, default: Date.now },
    bidAmount: { type: Number },
    shippingAddress: {
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        streetAddress: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    shippingType: { type: String,  enum: ['standard', 'express'], required: true },
    orderStatus: { type: String, enum: ['pending', 'completed', 'canceled'], default: 'pending' },
    trackingNumber: { type: String },
    paymentStatus: { type: String, required: true, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    paymentId: { type: String},
}, { timestamps: true });

// Create the model
const OrderModel  = mongoose.model<IOrder>('Order', OrderSchema);

export default OrderModel;
