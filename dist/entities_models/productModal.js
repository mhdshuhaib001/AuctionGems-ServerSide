"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
    sellerId: { type: mongoose_1.default.Schema.Types.ObjectId, required: true, ref: 'Seller' },
    itemTitle: { type: String, required: true },
    categoryId: { type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Category' },
    description: { type: String },
    condition: { type: String, required: true },
    images: [String],
    auctionFormat: { type: String, required: true, enum: ['buy-it-now', 'auction'] },
    auctionStartDateTime: { type: String },
    auctionEndDateTime: { type: String },
    reservePrice: { type: Number, required: true },
    shippingType: { type: String, required: true, enum: ['standard', 'express'] },
    sold: { type: Boolean, default: false },
    finalBidAmount: { type: Number, default: null },
    auctionStatus: {
        type: String,
        enum: ['live', 'upcoming', 'ended', 'sold', 'relisted'],
    },
    currentBid: { type: Number },
}, { timestamps: true });
exports.ProductModel = mongoose_1.default.model("Product", ProductSchema);
exports.default = exports.ProductModel;
