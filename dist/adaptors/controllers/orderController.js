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
Object.defineProperty(exports, "__esModule", { value: true });
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
class OrderController {
    constructor(_orderUsecase) {
        this._orderUsecase = _orderUsecase;
    }
    createCheckoutSession(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { image, name, price, orderId } = req.body;
                console.log(req.body, "orderId=============================================");
                // if (!product || !product.name || !product.price) {
                //   throw new Error(
                //     "Invalid product details. Please ensure 'name' and 'price' are provided."
                //   );
                // }
                const sessionId = yield this._orderUsecase.createCheckoutSession(image, name, price, orderId);
                res.status(200).json({ id: sessionId });
            }
            catch (error) {
                console.error("Error creating checkout session:", error);
                res
                    .status(500)
                    .json({
                    message: error instanceof Error ? error.message : "Internal server error"
                });
            }
        });
    }
    createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { buyerId, sellerId, addressId, productId } = req.body;
                console.log(req.body, "req.body=============================================");
                //   console.log("Creating order with data:", {
                //     buyerId,
                //     sellerId,
                //     addressId,
                //     paymentMethodId,
                //     productId
                //   });
                const result = yield this._orderUsecase.createOrder(buyerId, sellerId, addressId, productId);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error creating order:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    fetchOrderByUserId(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.userId;
                console.log(userId, "userId");
                const order = yield this._orderUsecase.fetchOrderByUserId(userId);
                res.status(200).json(order);
            }
            catch (error) {
                console.error("Error fetching order by user ID:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    fetchOrderById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                const order = yield this._orderUsecase.fetchOrderById(orderId);
                res.status(200).json(order);
            }
            catch (error) {
                console.error("Error fetching order by ID:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    createSellerRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const revenueData = req.body;
                const newRevenue = yield this._orderUsecase.execute(revenueData);
                res.status(201).json({
                    success: true,
                    message: 'Seller Revenue created successfully!',
                    data: newRevenue,
                });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({
                    success: false,
                    message: 'Error creating seller revenue',
                    error: error instanceof Error ? error.message : 'Unknown error',
                });
            }
        });
    }
}
exports.default = OrderController;
