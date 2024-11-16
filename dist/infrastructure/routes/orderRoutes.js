"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const router = express_1.default.Router();
const handleCreateOrder = (req, res) => controllers_1.orderController.createOrder(req, res);
const handleCreateCheckoutSession = (req, res) => controllers_1.orderController.createCheckoutSession(req, res);
const handleFetchOrderByUserId = (req, res) => controllers_1.orderController.fetchOrderByUserId(req, res);
const handleFetchOrderById = (req, res) => controllers_1.orderController.fetchOrderById(req, res);
const handleAddRevanue = (req, res) => controllers_1.orderController.createSellerRevenue(req, res);
router.post("/checkout-session", handleCreateCheckoutSession);
router.post("/payment-intent", handleCreateOrder);
router.get("/user-orders/:userId", handleFetchOrderByUserId);
router.get("/order-details/:orderId", handleFetchOrderById);
router.post('/seller-revenue', handleAddRevanue);
exports.default = router;
