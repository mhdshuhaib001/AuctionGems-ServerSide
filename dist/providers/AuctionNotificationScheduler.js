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
exports.startAuctionCronJob = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const Notification_1 = __importDefault(require("../entities_models/Notification"));
const productModal_1 = __importDefault(require("../entities_models/productModal"));
const fireBaseConfig_1 = require("../infrastructure/config/services/fireBaseConfig");
const twilioWhatsappNotification_1 = require("../infrastructure/config/services/twilioWhatsappNotification");
const nodeMailer_1 = __importDefault(require("./nodeMailer"));
const scheduledNotifications = new Set();
const startAuctionCronJob = () => {
    node_cron_1.default.schedule("* * * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const now = new Date();
            const nowISO = now.toISOString();
            const nowUTCMinutes = now.getUTCMinutes();
            const nowUTCHours = now.getUTCHours();
            const subscriptions = yield Notification_1.default.find({});
            for (const subscription of subscriptions) {
                const { _id, fcmToken, auctionId, whatsappNumber, email } = subscription;
                if (scheduledNotifications.has(_id.toString())) {
                    console.log(`⏩ Notification for auction ${auctionId} already scheduled. Skipping.`);
                    continue;
                }
                const auction = yield productModal_1.default.findById(auctionId);
                console.log(`🔎 Processing auction ID: ${auctionId}`);
                if (!auction) {
                    console.warn(`⚠️ Auction ID ${auctionId} not found in database.`);
                    continue;
                }
                const auctionStartTime = auction.auctionStartDateTime
                    ? new Date(auction.auctionStartDateTime)
                    : null;
                if (!auctionStartTime || isNaN(auctionStartTime.getTime())) {
                    console.error(`🚫 Invalid or missing start time for auction ID ${auctionId}. Skipping.`);
                    continue;
                }
                const auctionStartISO = auctionStartTime.toISOString();
                const notificationTime = new Date(auctionStartTime.getTime() - 1 * 60 * 1000);
                const notificationISO = notificationTime.toISOString();
                const notificationHours = notificationTime.getUTCHours();
                const notificationMinutes = notificationTime.getUTCMinutes();
                if (nowUTCHours === notificationHours &&
                    nowUTCMinutes === notificationMinutes) {
                    const productName = auction.itemTitle || "Unknown Product";
                    const productImage = ((_a = auction.images) === null || _a === void 0 ? void 0 : _a[0]) || "";
                    const productUrl = `${process.env.FRONTEND_URL}/product-details/${auctionId}`;
                    const price = auction.reservePrice || "0";
                    if (fcmToken) {
                        yield (0, fireBaseConfig_1.sendAuctionAlert)(fcmToken, `Auction Alert: "${productName}" starts soon!`, productImage, productUrl);
                        console.log(`✅ Push notification sent for auction ${auctionId} - Product: ${productName}`);
                    }
                    if (whatsappNumber) {
                        const productName = auction.itemTitle || "Unknown Product";
                        const productImage = ((_b = auction.images) === null || _b === void 0 ? void 0 : _b[0]) || "";
                        const productUrl = `${process.env.FRONTEND_URL}/product-details/${auctionId}`;
                        const price = auction.reservePrice || "0";
                        yield (0, twilioWhatsappNotification_1.whatsAppNotification)(whatsappNumber, productName, price, productUrl, productImage);
                        console.log(`✅ WhatsApp message sent to ${whatsappNumber} for auction ${auctionId}`);
                    }
                    if (email) {
                        const nodeMailer = new nodeMailer_1.default();
                        yield nodeMailer.sendAuctionStartingSoonEmail(email, productUrl, productName, price, auctionStartISO, productImage);
                        console.log(`✅ Email sent to ${email} for auction ${auctionId}`);
                    }
                    scheduledNotifications.add(_id.toString());
                }
                else {
                    console.log(`⏲️ Notification time not yet reached for auction ${auctionId}. Current time (ISO): ${nowISO}`);
                }
            }
            console.log("✅ Cron job execution completed.");
        }
        catch (error) {
            console.error("❌ Error encountered in cron job for auction notifications:", error);
        }
    }));
};
exports.startAuctionCronJob = startAuctionCronJob;
