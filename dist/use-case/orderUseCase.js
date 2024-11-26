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
exports.OrderUsecase = void 0;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
class OrderUsecase {
    constructor(_orderRepository, _sellerRepository, _userRepository) {
        this._orderRepository = _orderRepository;
        this._sellerRepository = _sellerRepository;
        this._userRepository = _userRepository;
    }
    createOrder(userId, sellerId, addressId, productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this._sellerRepository.getProductById(productId);
                const address = yield this._userRepository.getAddressById(addressId);
                if (!product)
                    throw new Error("Product not found");
                if (!address)
                    throw new Error("Address not found");
                if (!product.reservePrice)
                    throw new Error("Reserve price is missing for the product");
                const reservePrice = Math.floor(Number(product.reservePrice) || 0);
                const PLATFORM_FEE_PERCENTAGE = 0.03;
                const platformFee = Math.ceil(reservePrice * PLATFORM_FEE_PERCENTAGE);
                const sellerEarnings = reservePrice - platformFee;
                const orderData = {
                    productId,
                    buyerId: userId,
                    sellerId,
                    bidAmount: reservePrice,
                    shippingAddress: {
                        fullName: address.fullName,
                        phoneNumber: address.phoneNumber,
                        streetAddress: address.streetAddress,
                        city: address.city,
                        state: address.state,
                        postalCode: address.postalCode,
                        country: address.country
                    },
                    shippingType: "standard",
                    paymentStatus: "pending",
                    orderStatus: "pending"
                };
                const order = yield this._orderRepository.saveOrder(orderData);
                const escrowData = {
                    orderId: order._id,
                    buyerId: userId,
                    sellerId,
                    totalAmount: reservePrice,
                    platformFee,
                    sellerEarnings,
                    status: 'held'
                };
                yield this._orderRepository.createEscrow(escrowData);
                return order._id;
            }
            catch (error) {
                console.error("Error during order creation:", error instanceof Error ? error.message : error);
                throw new Error("Order creation failed: " +
                    (error instanceof Error ? error.message : "An unknown error occurred"));
            }
        });
    }
    createCheckoutSession(image, name, price, orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield stripe.checkout.sessions.create({
                    payment_method_types: ["card"],
                    metadata: {
                        orderId: orderId
                    },
                    line_items: [
                        {
                            price_data: {
                                currency: "usd",
                                product_data: {
                                    images: [image],
                                    name: name
                                },
                                unit_amount: price * 100
                            },
                            quantity: 1
                        }
                    ],
                    mode: "payment",
                    success_url: process.env.FRONTEND_SUCCESS_URL || "http://localhost:5173/success",
                    cancel_url: process.env.FRONTEND_CANCEL_URL || "http://localhost:5173/cancel"
                });
                return session.id;
            }
            catch (error) {
                console.error("Error creating checkout session:", error);
                if (error instanceof Error) {
                    throw new Error("Checkout session creation failed: " + error.message);
                }
                else {
                    throw new Error("Checkout session creation failed: An unknown error occurred");
                }
            }
        });
    }
    fetchOrderByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield this._orderRepository.fetchOrderByUserId(userId);
                const product = yield this._sellerRepository.getProductById(order.productId);
                const seller = yield this._sellerRepository.getSellerByUserId(order.sellerId);
                const address = yield this._userRepository.getAddressById(order.addressId);
                if (product) {
                    const responseData = {
                        orderId: order.id,
                        orderDate: order.orderDate,
                        status: order.status,
                        bidAmount: product.reservePrice,
                        productId: product._id,
                        productName: product.itemTitle || null,
                        productImage: product.images || null,
                        description: product.description || null,
                        companyName: (seller === null || seller === void 0 ? void 0 : seller.companyName) || "Unknown Seller",
                        paymentStatus: order.paymentStatus
                    };
                    return responseData;
                }
                else {
                    throw new Error("Product not found");
                }
            }
            catch (error) {
                console.error("Error fetching order by user ID:", error);
                throw new Error("Failed to fetch order by user ID");
            }
        });
    }
    fetchOrderById(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const order = yield this._orderRepository.fetchOrderById(orderId);
                if (!order || order.length === 0) {
                    return [];
                }
                const product = yield this._sellerRepository.getProductById(order.productId);
                if (!product) {
                    throw new Error("Product not found");
                }
                const responseData = {
                    orderId: order._id,
                    orderDate: order.orderDate,
                    status: order.orderStatus,
                    bidAmount: order.bidAmount,
                    productId: product._id,
                    productName: product.itemTitle || null,
                    productImage: product.images || null,
                    description: product.description || null,
                    companyName: ((_a = product.sellerId) === null || _a === void 0 ? void 0 : _a.companyName) || "Unknown Seller",
                    sellerId: ((_b = product.sellerId) === null || _b === void 0 ? void 0 : _b._id) || null,
                    profileName: ((_c = product.sellerId) === null || _c === void 0 ? void 0 : _c.profile) || null,
                    paymentStatus: order.paymentStatus,
                    shippingAddress: order.shippingAddress
                };
                return responseData;
            }
            catch (error) {
                console.error("Error fetching order by order ID:", error);
                throw new Error("Failed to fetch order by order ID");
            }
        });
    }
    execute(revenueData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const revenue = yield this._orderRepository.sellerRevenue(revenueData);
                return revenue;
            }
            catch (error) {
                throw new Error("Failed to add seller revenue");
            }
        });
    }
}
exports.OrderUsecase = OrderUsecase;
