import mongoose, { Document, Schema } from 'mongoose';

interface IOrder extends Document {
    productId: mongoose.Schema.Types.ObjectId;
    buyerId: mongoose.Schema.Types.ObjectId;
    sellerId: mongoose.Schema.Types.ObjectId;
    paymentId: mongoose.Schema.Types.ObjectId;
    orderDate: Date;
    bidAmount: number;
    shippingAddress: {
        fullName: string;
        phoneNumber: string;
        streetAddress: string;
        city: string;
        state: string;
        postalCode: string;
        country: string;
    };
    shippingType: 'standard' | 'express';
    orderStatus: 'pending' | 'completed' | 'canceled';
    paymentDueDate?: Date;
    trackingNumber:string
    status:string
    paymentStatus: 'pending' | 'completed' | 'failed'|'pending_payment';
}

export default IOrder;
