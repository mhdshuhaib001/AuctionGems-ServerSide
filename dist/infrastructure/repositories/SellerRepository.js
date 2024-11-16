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
const sellerModel_1 = __importDefault(require("../../entities_models/sellerModel"));
const productModal_1 = __importDefault(require("../../entities_models/productModal"));
const orderModel_1 = __importDefault(require("../../entities_models/orderModel"));
const inspector_1 = require("inspector");
const reviewModel_1 = __importDefault(require("../../entities_models/reviewModel"));
const sellerRevanue_1 = __importDefault(require("../../entities_models/sellerRevanue"));
const mongoose_1 = __importDefault(require("mongoose"));
class SellerRepository {
    existsByEmail(email) {
        throw new Error("Method not implemented.");
    }
    insertOne(sellerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newSeller = new sellerModel_1.default(sellerData);
                yield newSeller.save();
                return newSeller;
            }
            catch (error) {
                inspector_1.console.error("Error inserting seller:", error);
                throw new Error("Failed to insert seller.");
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seller = yield sellerModel_1.default.findById(id).exec();
                return seller;
            }
            catch (error) {
                inspector_1.console.error("Error finding seller by ID:", error);
                throw new Error("Failed to find seller.");
            }
        });
    }
    existsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seller = yield sellerModel_1.default.findOne({ userId: userId }).exec();
                return seller;
            }
            catch (error) {
                inspector_1.console.error("Error checking if seller exists by UserID:", error);
                throw new Error("Failed to check seller existence.");
            }
        });
    }
    existsBySellerId(_id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seller = yield sellerModel_1.default.findOne({ _id }).exec();
                inspector_1.console.log(seller);
                return seller;
            }
            catch (error) {
                inspector_1.console.error("Error checking if seller exists by email or ID:", error);
                throw new Error("Failed to check seller existence.");
            }
        });
    }
    findByName(CompanyName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seller = yield sellerModel_1.default.findOne({ CompanyName });
                return seller;
            }
            catch (error) {
                inspector_1.console.error("Error finding seller by name", error);
                throw new Error("Failed to find seller");
            }
        });
    }
    getAllProducts(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield productModal_1.default.find({ sellerId })
                    .populate("categoryId", "name")
                    .exec();
                if (!products || products.length === 0) {
                    throw new Error("No products found for this seller.");
                }
                return products;
            }
            catch (error) {
                inspector_1.console.error("Error getting all products for seller:", error);
                throw new Error("Failed to get products.");
            }
        });
    }
    deleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield productModal_1.default.findByIdAndDelete(productId);
                if (!result) {
                    throw new Error("Product not found");
                }
            }
            catch (error) {
                inspector_1.console.error("Error deleting product:", error);
                throw new Error("Failed to delete product.");
            }
        });
    }
    findSeller(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                inspector_1.console.log(id, 'sellerId');
                const seller = yield sellerModel_1.default.findById(id)
                    .populate("userId", "email")
                    .exec();
                return seller;
            }
            catch (error) {
                inspector_1.console.error("Error finding seller by ID:", error);
                throw new Error("Failed to find seller.");
            }
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield productModal_1.default.findById(productId)
                    .populate({
                    path: "sellerId",
                    select: "companyName profile"
                })
                    .exec();
                if (!result) {
                    throw new Error("Product not found");
                }
                inspector_1.console.log(result, "result");
                return result;
            }
            catch (error) {
                inspector_1.console.error("Error fetching single product:", error);
                throw new Error("Failed to fetch product.");
            }
        });
    }
    getAll(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const total = yield productModal_1.default.countDocuments();
                const products = yield productModal_1.default.find()
                    .populate("categoryId", "name")
                    .skip((page - 1) * limit)
                    .limit(limit);
                return products;
            }
            catch (error) {
                inspector_1.console.error("Error getting all products:", error);
                throw new Error("Failed to get products.");
            }
        });
    }
    updateSeller(sellerId, sellerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSeller = yield sellerModel_1.default.findByIdAndUpdate(sellerId, sellerData, { new: true, runValidators: true }).exec();
                if (!updatedSeller) {
                    throw new Error("Seller not found");
                }
                return updatedSeller;
            }
            catch (error) {
                inspector_1.console.error("Error updating seller:", error);
                throw new Error("Failed to update seller.");
            }
        });
    }
    getAllOrders(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield orderModel_1.default.find({ sellerId })
                    .populate("productId", "itemTitle images")
                    .populate("buyerId", "name")
                    .exec();
                return orders;
            }
            catch (error) {
                inspector_1.console.error("Error getting all orders for seller:", error);
                throw new Error("Failed to get orders.");
            }
        });
    }
    updateOrderStatus(orderId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedOrder = yield orderModel_1.default.findByIdAndUpdate(orderId, { orderStatus: newStatus }, { new: true }).exec();
                if (!updatedOrder) {
                    throw new Error("Order not found");
                }
                return updatedOrder;
            }
            catch (error) {
                inspector_1.console.error("Error updating order status:", error);
                throw new Error("Failed to update order status.");
            }
        });
    }
    getAllSeller() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerDatas = yield sellerModel_1.default.find();
                inspector_1.console.log(sellerDatas);
                return sellerDatas;
            }
            catch (error) {
                inspector_1.console.log("Error finding All sellerDatas");
                throw new Error("Find all SellerData.");
            }
        });
    }
    getSellerByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const seller = yield sellerModel_1.default.findOne({ userId }).exec();
                return seller;
            }
            catch (error) {
                inspector_1.console.error("Error getting seller by userId:", error);
                throw new Error("Failed to get seller.");
            }
        });
    }
    addReview(reviewData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield reviewModel_1.default.create(reviewData);
                return response;
            }
            catch (error) {
                inspector_1.console.error("Error adding review:", error);
                throw new Error("Could not add review");
            }
        });
    }
    findReviewsBySellerId(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Id = new mongoose_1.default.Types.ObjectId(sellerId);
                const response = reviewModel_1.default.find({ sellerId: Id }).populate('user', 'name profileImage');
                inspector_1.console.log(response, 'this is the review response');
                return response;
            }
            catch (error) {
                throw new Error("Could not find review");
            }
        });
    }
    getSellerMetrics(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            const now = new Date();
            const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const [totalEarnings, monthlySpend, currentMonthSales, lastMonthSales] = yield Promise.all([
                sellerRevanue_1.default.aggregate([
                    { $match: { sellerId } },
                    { $group: { _id: null, total: { $sum: "$sellerEarnings" } } }
                ]),
                sellerRevanue_1.default.aggregate([
                    {
                        $match: {
                            sellerId,
                            createdAt: { $gte: firstDayOfMonth }
                        }
                    },
                    { $group: { _id: null, total: { $sum: "$platformFee" } } }
                ]),
                sellerRevanue_1.default.aggregate([
                    {
                        $match: {
                            sellerId,
                            createdAt: { $gte: firstDayOfMonth }
                        }
                    },
                    { $group: { _id: null, total: { $sum: "$sellerEarnings" } } }
                ]),
                sellerRevanue_1.default.aggregate([
                    {
                        $match: {
                            sellerId,
                            createdAt: {
                                $gte: firstDayOfLastMonth,
                                $lt: firstDayOfMonth
                            }
                        }
                    },
                    { $group: { _id: null, total: { $sum: "$sellerEarnings" } } }
                ])
            ]);
            const currentSales = ((_a = currentMonthSales[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
            const previousSales = ((_b = lastMonthSales[0]) === null || _b === void 0 ? void 0 : _b.total) || 0;
            const salesGrowth = previousSales === 0 ? 100 :
                ((currentSales - previousSales) / previousSales) * 100;
            return {
                totalEarnings: ((_c = totalEarnings[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
                monthlySpend: ((_d = monthlySpend[0]) === null || _d === void 0 ? void 0 : _d.total) || 0,
                totalSales: currentSales,
                salesGrowth
            };
        });
    }
    getSalesData(sellerId, timeframe) {
        return __awaiter(this, void 0, void 0, function* () {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const aggregation = yield sellerRevanue_1.default.aggregate([
                {
                    $match: {
                        sellerId,
                        createdAt: { $gte: oneYearAgo }
                    }
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" },
                            week: { $week: "$createdAt" },
                            day: { $dayOfWeek: "$createdAt" }
                        },
                        sales: { $sum: "$sellerEarnings" }
                    }
                }
            ]);
            return this.formatSalesData(aggregation, timeframe);
        });
    }
    getCategoryDistribution(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const distribution = yield productModal_1.default.aggregate([
                {
                    $match: { sellerId, sold: true }
                },
                {
                    $lookup: {
                        from: 'categories',
                        localField: 'categoryId',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                {
                    $group: {
                        _id: "$categoryId",
                        name: { $first: "$category.name" },
                        value: { $sum: 1 }
                    }
                }
            ]);
            return distribution.map(item => ({
                name: item.name[0] || 'Uncategorized',
                value: item.value
            }));
        });
    }
    formatSalesData(aggregation, timeframe) {
        const timeFrameFormats = {
            daily: {
                labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
                length: 7
            },
            weekly: {
                labels: Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`),
                length: 4
            },
            monthly: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                length: 12
            },
            yearly: {
                labels: Array.from({ length: 4 }, (_, i) => `${new Date().getFullYear() - 3 + i}`),
                length: 4
            }
        };
        const format = timeFrameFormats[timeframe];
        const formatted = Array.from({ length: format.length }, (_, i) => ({
            label: format.labels[i],
            sales: 0
        }));
        // Populate with actual data
        aggregation.forEach(item => {
            const { year, month, week, day } = item._id;
            let index = 0;
            switch (timeframe) {
                case 'daily':
                    index = day - 1;
                    break;
                case 'weekly':
                    index = week % 4;
                    break;
                case 'monthly':
                    index = month - 1;
                    break;
                case 'yearly':
                    index = year - (new Date().getFullYear() - 3);
                    break;
            }
            if (index >= 0 && index < format.length) {
                formatted[index].sales = item.sales;
            }
        });
        return formatted;
    }
}
exports.default = SellerRepository;
