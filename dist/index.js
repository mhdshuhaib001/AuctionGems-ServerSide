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
const app_1 = require("./infrastructure/config/app");
const DBconfig_1 = require("./infrastructure/config/DBconfig");
const dotenv_1 = __importDefault(require("dotenv"));
const socket_io_1 = require("./infrastructure/config/services/socket-io");
const corn_1 = require("./providers/corn");
const AuctionNotificationScheduler_1 = require("./providers/AuctionNotificationScheduler");
dotenv_1.default.config();
console.log("Environment Variables Loaded:");
console.log("DATABASE_URL:", process.env.DATABASE_URL);
console.log("PORT:", process.env.PORT);
console.log("GMAIL:", process.env.GMAIL);
console.log("JWT_KEY:", process.env.JWT_KEY);
console.log("CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET);
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL);
console.log("STRIPE_SECRET_KEY:", process.env.STRIPE_SECRET_KEY);
console.log("TWILIO_ACCOUNT_SID:", process.env.TWILIO_ACCOUNT_SID);
console.log("FRONTEND_URL:", process.env.FRONTEND_URL);
console.log("BACKEND_URL:", process.env.BACKEND_URL);
console.log("GEMINI_API_KEY:", process.env.GEMINI_API_KEY);
console.log("FIREBASE_PROJECT_ID:", process.env.FIREBASE_PROJECT_ID);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, DBconfig_1.DBconfig)();
        const port = process.env.PORT;
        const url = process.env.BACKEND_URL;
        const { app, server } = (0, app_1.createServer)();
        // Initialize Socket.io
        (0, socket_io_1.socketIoInit)(server);
        // Auction Notification cron 
        (0, AuctionNotificationScheduler_1.startAuctionCronJob)();
        (0, corn_1.initAuctionCronJob)();
        // Auction pending payment relist 
        (0, corn_1.initRelistAuctionCronJob)();
        server.listen(port, () => console.log(`Server running at ${url}`));
    }
    catch (error) {
        console.error("Error starting server:", error);
    }
});
startServer();
