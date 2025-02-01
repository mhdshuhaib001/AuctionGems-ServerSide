"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createServer = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("../routes/authRoutes"));
const sellerRoutes_1 = __importDefault(require("../routes/sellerRoutes"));
const adminRoutes_1 = __importDefault(require("../routes/adminRoutes"));
const productRoutes_1 = __importDefault(require("../routes/productRoutes"));
const cors_1 = __importDefault(require("cors"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const swaggerConfi_1 = require("../swagger/swaggerConfi");
const orderRoutes_1 = __importDefault(require("../routes/orderRoutes"));
const webhook_1 = __importDefault(require("./services/webhook"));
const http_1 = __importDefault(require("http"));
const chatRoutes_1 = __importDefault(require("../routes/chatRoutes"));
const auctionRoutes_1 = __importDefault(require("../routes/auctionRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const createServer = () => {
    try {
        const app = (0, express_1.default)();
        dotenv_1.default.config();
        app.use((0, morgan_1.default)("dev"));
        // Parse JSON bodies
        app.use(express_1.default.json({ limit: '10mb' }));
        app.use(express_1.default.urlencoded({ limit: '10mb', extended: true }));
        // CORS configuration
        app.use((0, cors_1.default)({
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            credentials: true
        }));
        app.use((0, helmet_1.default)());
        app.use((req, res, next) => {
            res.setHeader("Content-Security-Policy", "default-src 'self'; " +
                "script-src 'self' https://js.stripe.com 'sha256-5+YTmTcBwCYdJ8Jetbr6kyjGp0Ry/H7ptpoun6CrSwQ='; " +
                "connect-src 'self' https://api.stripe.com; " +
                "frame-src https://js.stripe.com;");
            next();
        });
        // Swagger Documentation
        app.use("/api-docs", swaggerConfi_1.swaggerDocs.serve, swaggerConfi_1.swaggerDocs.setup);
        app.get('/health', (req, res) => {
            res.status(200).send('OK  , THE CHEKC IS OKEY');
        });
        // Routes
        app.use("/api/auth", authRoutes_1.default);
        app.use("/api/user", userRoutes_1.default);
        app.use("/api/seller", sellerRoutes_1.default);
        app.use("/api/admin", adminRoutes_1.default);
        app.use("/api/products", productRoutes_1.default);
        app.use("/api/orders", orderRoutes_1.default);
        app.use("/api/chat", chatRoutes_1.default);
        app.use('/api/auction', auctionRoutes_1.default);
        app.use("/api/webhook", webhook_1.default);
        const server = http_1.default.createServer(app);
        return { app, server };
    }
    catch (error) {
        console.error("Error creating server:", error);
        throw error;
    }
};
exports.createServer = createServer;
