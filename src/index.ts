import { createServer } from "./infrastructure/config/app";
import { DBconfig } from "./infrastructure/config/DBconfig";
import dotenv from "dotenv";
import { socketIoInit } from "./infrastructure/config/services/socket-io";
import { initAuctionCronJob ,initRelistAuctionCronJob } from "./providers/corn";
import { initSocket } from './infrastructure/config/services/auctionSocket';
import { startAuctionCronJob } from "./providers/AuctionNotificationScheduler";

dotenv.config();

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

const startServer = async () => {
  try {
    await DBconfig();

    const port = process.env.PORT || 8000;
    const url = process.env.BACKEND_URL;

    const { app, server } = createServer();

    // initSocket(server)
    // Initialize Socket.io
    socketIoInit(server);
    // Auction Notifgication corn 
    startAuctionCronJob();
    initAuctionCronJob();
    // Auction pebnding payment relist 
    initRelistAuctionCronJob()
    server.listen(port, () => console.log(`Server running at ${url}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
