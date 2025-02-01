import { createServer } from "./infrastructure/config/app";
import { DBconfig } from "./infrastructure/config/DBconfig";
import dotenv from "dotenv";
import { socketIoInit } from "./infrastructure/config/services/socket-io";
import { initAuctionCronJob, initRelistAuctionCronJob } from "./providers/corn";
import { initSocket } from './infrastructure/config/services/auctionSocket';
import { startAuctionCronJob } from "./providers/AuctionNotificationScheduler";

dotenv.config();



const startServer = async () => {
  try {
    await DBconfig();

    const port = process.env.PORT; 
    const url = process.env.BACKEND_URL ;

    const { app, server } = createServer();

    // Initialize Socket.io
    socketIoInit(server);
    // Auction Notification cron 
    startAuctionCronJob();
    initAuctionCronJob();
    // Auction pending payment relist 
    initRelistAuctionCronJob();

    server.listen(port, () => console.log(`Server running at ${url}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();