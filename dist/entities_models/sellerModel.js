"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Seller schema
const sellerSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
const SellerModel = (0, mongoose_1.model)('Seller', sellerSchema);
exports.default = SellerModel;
