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
exports.OrderRepository = void 0;
const orderModel_1 = __importDefault(require("../../entities_models/orderModel"));
const revenueModel_1 = __importDefault(require("../../entities_models/revenueModel"));
const sellerRevanue_1 = __importDefault(require("../../entities_models/sellerRevanue"));
// import { IOrder } from "../../interfaces/model/order";
class OrderRepository {
    findOrderId(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield orderModel_1.default.findOne({ _id: orderId });
                return order;
            }
            catch (error) {
                console.error("Error finding order by payment ID:", error);
                throw new Error("Failed to find order by order ID");
            }
        });
    }
    saveOrder(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield orderModel_1.default.create(orderData);
                return order;
            }
            catch (error) {
                // Handle errors
                console.error("Error saving order:", error);
                throw new Error("Failed to save order");
            }
        });
    }
    updateOrder(order) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield orderModel_1.default.findByIdAndUpdate(order.id, order);
                return true;
            }
            catch (error) {
                console.error("Error updating order:", error);
                throw new Error("Failed to update order");
            }
        });
    }
    fetchOrderByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield orderModel_1.default.findOne({ buyerId: userId });
                return order;
            }
            catch (error) {
                console.error("Error finding order by user ID:", error);
                throw new Error("Failed to find order by user ID");
            }
        });
    }
    fetchOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield orderModel_1.default.findOne({ _id: orderId });
                return order;
            }
            catch (error) {
                console.error("Error finding order by order ID:", error);
                throw new Error("Failed to find order by order ID");
            }
        });
    }
    addRevenue(revenueData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield new revenueModel_1.default({
                    date: new Date().toISOString(),
                    revenue: revenueData.platformFee + revenueData.sellerEarnings,
                    orderId: revenueData.orderId,
                    productId: revenueData.productId,
                    sellerId: revenueData.sellerId
                }).save();
            }
            catch (error) {
                console.error("Error saving revenue data:", error);
                throw new Error("Failed to save revenue data");
            }
        });
    }
    sellerRevenue(revenueData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(revenueData);
                const revenue = yield sellerRevanue_1.default.create(revenueData);
                return revenue;
            }
            catch (error) {
                console.error("Error adding seller revenue:", error);
                throw new Error("Failed to add seller revenue");
            }
        });
    }
}
exports.OrderRepository = OrderRepository;
