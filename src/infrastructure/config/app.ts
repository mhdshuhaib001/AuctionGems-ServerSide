import express from "express";
import dotenv from "dotenv";
import authRouter from "../routes/authRoutes";
import sellerRouter from "../routes/sellerRoutes";
import adminRouter from "../routes/adminRoutes";
import productRoute from "../routes/productRoutes";
import cors from "cors";
import userRoute from "../routes/userRoutes";
import { swaggerDocs } from "../swagger/swaggerConfi";
import orderRoutes from "../routes/orderRoutes";
import webhook from "./services/webhook"; 
import http from 'http';  
import chatRoute from "../routes/chatRoutes";
import auctionRout from '../routes/auctionRoutes'
import morgan from "morgan";
import helmet from "helmet";

export const createServer = () => {
  try {
    const app = express();
    dotenv.config();
    app.use(morgan("dev"));

    // Parse JSON bodies
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ limit: '10mb', extended: true }));

    // CORS configuration
    // the auction localhost is run on the https://auction-gems.vercel.app/ 
    app.use(cors({
      // origin: process.env.FRONTEND_URL,
      origin: 'https://auction-gemss.vercel.app',

      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      credentials: true
    }));

    app.use(helmet());

    app.use((req, res, next) => {
      res.setHeader("Content-Security-Policy", 
        "default-src 'self'; " +
        "script-src 'self' https://js.stripe.com 'sha256-5+YTmTcBwCYdJ8Jetbr6kyjGp0Ry/H7ptpoun6CrSwQ='; " + 
        "connect-src 'self' https://api.stripe.com; " +
        "frame-src https://js.stripe.com;");
      next();
    });

    // Swagger Documentation
    app.use("/api-docs", swaggerDocs.serve, swaggerDocs.setup);

    // Routes
    app.use("/api/auth", authRouter);
    app.use("/api/user", userRoute);
    app.use("/api/seller", sellerRouter);
    app.use("/api/admin", adminRouter);
    app.use("/api/products", productRoute);
    app.use("/api/orders", orderRoutes);
    app.use("/api/chat", chatRoute);
    app.use('/api/auction',auctionRout)
    app.use("/api/webhook", webhook);

    const server = http.createServer(app);

    return { app, server };
  } catch (error) {
    console.error("Error creating server:", error);
    throw error;
  }
};
