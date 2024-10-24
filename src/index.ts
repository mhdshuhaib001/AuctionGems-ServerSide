import { createServer } from "./infrastructure/config/app";
import { DBconfig } from "./infrastructure/config/DBconfig";
import dotenv from "dotenv";
import { socketIoInit } from "./infrastructure/config/services/socket-io";
import { initAuctionCronJob } from "./providers/corn";
import { initSocket } from './infrastructure/config/services/auctionSocket';

dotenv.config();

const startServer = async () => {
  try {
    // Initialize the database connection
    await DBconfig();

    const port = process.env.PORT || 8001;
    const url = `http://localhost:${port}`;

    const { app, server } = createServer();

    initSocket(server)
    // Initialize Socket.io
    socketIoInit(server);
    // Initialize the auction cron job

    initAuctionCronJob();
    server.listen(port, () => console.log(`Server running at ${url}`));
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
