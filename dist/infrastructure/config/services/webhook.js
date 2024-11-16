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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const stripe_1 = __importDefault(require("stripe"));
const OrderRepository_1 = require("../../repositories/OrderRepository");
const router = express_1.default.Router();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2024-09-30.acacia',
});
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
router.post('/webhook', body_parser_1.default.raw({ type: 'application/json' }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const sig = req.headers['stripe-signature'];
    let event = req.body;
    if (event.type === 'checkout.session.completed') {
        const checkoutSession = event.data.object;
        const orderId = (_a = checkoutSession.metadata) === null || _a === void 0 ? void 0 : _a.orderId;
        const orderRepository = new OrderRepository_1.OrderRepository();
        try {
            const order = yield orderRepository.findOrderId(orderId);
            if (order) {
                order.paymentStatus = 'paid';
                yield orderRepository.updateOrder(order);
                console.log(`Order ${order.id} updated to 'paid'.`);
            }
            else {
                console.error(`Order not found for payment ID: ${checkoutSession.id}`);
            }
        }
        catch (error) {
            console.error(`Error updating order:`, error);
            return res.status(500).send('Error updating order');
        }
    }
    res.status(200).json({ received: true });
}));
exports.default = router;
