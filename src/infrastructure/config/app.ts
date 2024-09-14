import express from "express";
import dotenv from "dotenv";
import authRouter from "../routes/authRouter";
import sellerRouter from "../routes/sellerRout";
import adminRouter from "../routes/adminRoute";
import cors from "cors";
import { swaggerDocs } from "../swagger/swaggerConfi";

export const createServer = () => {
  try {
    const app = express();
    dotenv.config();

    app.use(express.json({ limit: "50mb" }));
    app.use(express.urlencoded({ limit: "50mb", extended: true }));

    // CORS configuration
    app.use(
      cors({
        origin: "http://localhost:5173",
        methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        credentials: true
      })
    );

    // Swagger Documentation
    app.use("/api-docs", swaggerDocs.serve, swaggerDocs.setup);

    // Auth and seller routes
    app.use("/api/auth", authRouter);
    app.use("/api/seller", sellerRouter);
    app.use("/api/admin", adminRouter);

    return app;
  } catch (error) {
    console.error("Error creating server:", error);
    throw error;
  }
};
