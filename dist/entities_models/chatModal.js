"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ChatSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    recipientId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ["sent", "delivered", "read"], default: "sent" }
});
const Chat = mongoose_1.default.model("Chat", ChatSchema);
exports.default = Chat;
