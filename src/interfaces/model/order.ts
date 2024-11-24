import mongoose from "mongoose";

export default interface IOrder {
  productId: mongoose.Types.ObjectId;
  buyerId: mongoose.Types.ObjectId;
  sellerId: mongoose.Types.ObjectId;
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
  shippingType: "standard" | "express" | "fragile";
  orderStatus: 
    | "pending" 
    | "processing" 
    | "shipped" 
    | "delivered" 
    | "completed" 
    | "canceled" 
    | "pending_payment";
  paymentStatus: 
    | "pending" 
    | "escrowed" 
    | "completed" 
    | "failed" 
    | "refunded";
  
  escrowStatus?: 
    | "pending" 
    | "delivered" 
    | "confirmed" 
    | "disputed";
  
  deliveryDate?: Date;
  deliveryConfirmationDate?: Date;
  isDeliveryConfirmed?: boolean;
  disputeReason?: string;
  trackingNumber?: string;
  paymentDueDate?: Date;
  paymentId?: string;
}