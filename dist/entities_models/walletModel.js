"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletModel = void 0;
const mongoose_1 = require("mongoose");
const walletHistorySchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    transactionType: {
        type: String,
        enum: ["credit", "debit"],
        required: true,
    },
    description: { type: String, required: true },
    date: { type: Date, default: Date.now },
});
const walletSchema = new mongoose_1.Schema({
    balance: { type: Number, default: 0 },
    walletHistory: { type: [walletHistorySchema], default: [] },
});
const WalletModel = (0, mongoose_1.model)("Wallet", walletSchema);
exports.WalletModel = WalletModel;
