"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const OrderSchema = new mongoose_1.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "Product"
    },
    buyerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    sellerId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
        enum: [
            "pending",
            "processing",
            "shipped",
            "delivered",
            "completed",
            "canceled",
            "pending_payment"
        ],
        default: "pending"
    },
    paymentStatus: {
        type: String,
        required: true,
        enum: ["pending", "escrowed", "completed", "failed", "refunded"],
        default: "pending"
    },
    trackingNumber: { type: String },
    escrowStatus: {
        type: String,
        enum: ["pending", "delivered", "confirmed", "disputed"],
        default: "pending"
    },
    deliveryDate: { type: Date },
    deliveryConfirmationDate: { type: Date },
    isDeliveryConfirmed: {
        type: Boolean,
        default: false
    },
    disputeReason: { type: String },
    paymentDueDate: { type: Date },
    paymentId: { type: String }
}, { timestamps: true });
const OrderModel = mongoose_1.default.model("Order", OrderSchema);
exports.default = OrderModel;
