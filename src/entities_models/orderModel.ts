import mongoose, { Schema } from "mongoose";
import IOrder from "../interfaces/model/order";

const OrderSchema: Schema<IOrder> = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product"
    },
    buyerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User"
    },
    sellerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Seller"
    },
    orderDate: { type: Date, default: Date.now },
    bidAmount: { type: Number },
    shippingAddress: {
      fullName: { type: String },
      phoneNumber: { type: String },
      streetAddress: { type: String },
      city: { type: String },
      state: { type: String },
      postalCode: { type: String },
      country: { type: String }
    },
    shippingType: {
      type: String,
      enum: ["standard", "express", "fragile"],
      required: true
    },
    orderStatus: {
      type: String,
      enum: ["pending", "completed", "canceled", "pending_payment"],
      default: "pending"
    },
    trackingNumber: { type: String },
    status: { type: String },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending"
    },
    paymentDueDate: { type: Date },
    paymentId: { type: String }
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderModel;
