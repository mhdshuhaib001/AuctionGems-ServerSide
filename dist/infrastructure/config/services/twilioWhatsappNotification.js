"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whatsAppNotification = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = (0, twilio_1.default)(accountSid, authToken);
const whatsAppNotification = (to, productName, price, productUrl, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = `
🛍️ Auction Reminder!
The auction for "${productName}" is starting in 5 minutes!

📅 Starting Price: ${price}
🔗 Product Link: ${productUrl}

Don't miss your chance to bid!
`;
        const response = yield client.messages.create({
            from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
            to: `whatsapp:+${to}`,
            body: message,
            mediaUrl: [imageUrl]
        });
        console.log(`Message sent: ${response.sid}`);
    }
    catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
});
exports.whatsAppNotification = whatsAppNotification;
