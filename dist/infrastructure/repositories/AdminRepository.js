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
const userModel_1 = require("../../entities_models/userModel");
const categoryModel_1 = __importDefault(require("../../entities_models/categoryModel"));
const reportModal_1 = __importDefault(require("../../entities_models/reportModal"));
const reportModal_2 = __importDefault(require("../../entities_models/reportModal"));
const sellerModel_1 = __importDefault(require("../../entities_models/sellerModel"));
const adminRevenueModel_1 = __importDefault(require("../../entities_models/adminRevenueModel"));
const productModal_1 = __importDefault(require("../../entities_models/productModal"));
const Notification_1 = __importDefault(require("../../entities_models/Notification"));
const escrowModel_1 = __importDefault(require("../../entities_models/escrowModel"));
const escrowModel_2 = __importDefault(require("../../entities_models/escrowModel"));
class AdminRepository {
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userModel_1.UserModel.find().exec();
                return users;
            }
            catch (error) {
                throw new Error("Error fetching users");
            }
        });
    }
    updateUserStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.UserModel.findById(userId).exec();
                if (!user) {
                    throw new Error(`User with ID ${userId} not found`);
                }
                user.isActive = !user.isActive;
                const result = yield user.save();
                console.log(result, 'this si the status result');
                return result;
            }
            catch (error) {
                throw new Error(`Error updating user status with ID ${userId}: ${error}`);
            }
        });
    }
    addCategory(categoryData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Category = new categoryModel_1.default(categoryData);
                yield Category.save();
                return true;
            }
            catch (error) {
                throw new Error(`Error adding new category: ${error}`);
            }
        });
    }
    getAllCategory(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = pagination;
                const categories = yield categoryModel_1.default.find()
                    .skip((page - 1) * limit)
                    .limit(limit);
                const totalCategories = yield categoryModel_1.default.countDocuments();
                return {
                    categories,
                    totalCategories
                };
            }
            catch (error) {
                throw new Error("Error fetching categories");
            }
        });
    }
    updateCategory(_id, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedCategory = yield categoryModel_1.default.findByIdAndUpdate(_id, updatedData, {
                    new: true
                });
                return updatedCategory;
            }
            catch (error) {
                throw new Error("Error updateing categories");
            }
        });
    }
    getAllCategorys() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryModel_1.default.find();
                return categories;
            }
            catch (error) {
                throw new Error("Error fetching categories");
            }
        });
    }
    getCategoryByIds(categoryIds) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield categoryModel_1.default.find({
                    _id: { $in: categoryIds }
                });
                return categories;
            }
            catch (error) {
                throw new Error("Error fetching categories");
            }
        });
    }
    getCategoryById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield categoryModel_1.default.findOne({ _id: id });
                return category || null;
            }
            catch (error) {
                console.error("Error fetching category by ID:", error);
                throw new Error("Error fetching category by ID");
            }
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield categoryModel_1.default.findByIdAndDelete(categoryId);
                return result;
            }
            catch (error) {
                throw new Error("Error deleting category");
            }
        });
    }
    addReport(reportData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newReport = yield new reportModal_1.default(reportData);
                yield newReport.save();
                console.log("Report added successfully to the database");
            }
            catch (error) {
                throw new Error(`Error adding report: ${error}`);
            }
        });
    }
    getReports() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield reportModal_2.default
                    .find()
                    .populate("reportedBy", "name")
                    .populate("sellerId", "companyName")
                    .lean();
                return reports;
            }
            catch (error) {
                throw new Error(`Error fetching reports: ${error}`);
            }
        });
    }
    updateReportStatus(reportId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = (yield reportModal_2.default.findOneAndUpdate({ _id: reportId }, { status, updatedAt: new Date() }, { new: true }));
                return result;
            }
            catch (error) {
                console.error("Error updating report status in repository:", error);
                throw new Error("Could not update report status");
            }
        });
    }
    countConfirmedReports(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return reportModal_2.default.countDocuments({
                sellerId,
                status: "confirmed",
                createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
            });
        });
    }
    blockSeller(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield sellerModel_1.default.findByIdAndUpdate(sellerId, {
                isBlocked: true
            });
        });
    }
    getNotificationSubscription(auctionId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield Notification_1.default.findOne({ auctionId, userId });
            }
            catch (error) {
                console.error("Error fetching notification subscription:", error);
                throw error;
            }
        });
    }
    upsertNotificationPreferences(userId, auctionId, fcmToken, email, whatsappNumber, auctionStartTime) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield Notification_1.default.findOneAndUpdate({ userId, auctionId }, {
                    userId,
                    auctionId,
                    fcmToken,
                    email,
                    whatsappNumber,
                    auctionStartTime
                }, { upsert: true, new: true });
            }
            catch (error) {
                console.error("Error in upsertNotificationPreferences:", error);
                throw new Error("Failed to upsert notification preferences.");
            }
        });
    }
    findAllEscrow(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (filters === null || filters === void 0 ? void 0 : filters.status) {
                query.status = filters.status;
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.startDate) && (filters === null || filters === void 0 ? void 0 : filters.endDate)) {
                query.createdAt = {
                    $gte: filters.startDate,
                    $lte: filters.endDate
                };
            }
            // Enhanced search logic with searchType
            if (filters === null || filters === void 0 ? void 0 : filters.searchTerm) {
                if (filters.searchType === 'seller') {
                    query['sellerId'] = { $regex: filters.searchTerm, $options: 'i' };
                }
                else if (filters.searchType === 'buyer') {
                    query['buyerId'] = { $regex: filters.searchTerm, $options: 'i' };
                }
                else {
                    // Default 'all' search across multiple fields
                    query.$or = [
                        { 'orderId._id': { $regex: filters.searchTerm, $options: 'i' } },
                        { 'buyerId.name': { $regex: filters.searchTerm, $options: 'i' } },
                        { 'sellerId.companyName': { $regex: filters.searchTerm, $options: 'i' } }
                    ];
                }
            }
            const page = (filters === null || filters === void 0 ? void 0 : filters.page) || 1;
            const limit = (filters === null || filters === void 0 ? void 0 : filters.limit) || 10;
            const skip = (page - 1) * limit;
            const [escrowPayments, totalCount] = yield Promise.all([
                escrowModel_1.default.find(query)
                    .populate('buyerId')
                    .populate('sellerId')
                    .skip(skip)
                    .limit(limit)
                    .lean(),
                escrowModel_1.default.countDocuments(query)
            ]);
            return {
                data: escrowPayments,
                totalCount,
                totalPages: Math.ceil(totalCount / limit),
                currentPage: page
            };
        });
    }
    getEscrowSummary(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (filters === null || filters === void 0 ? void 0 : filters.status) {
                query.status = filters.status;
            }
            if ((filters === null || filters === void 0 ? void 0 : filters.startDate) && (filters === null || filters === void 0 ? void 0 : filters.endDate)) {
                query.createdAt = {
                    $gte: filters.startDate,
                    $lte: filters.endDate
                };
            }
            // Similar search logic as in findAllEscrow
            if (filters === null || filters === void 0 ? void 0 : filters.searchTerm) {
                if (filters.searchType === 'seller') {
                    query['sellerId'] = { $regex: filters.searchTerm, $options: 'i' };
                }
                else if (filters.searchType === 'buyer') {
                    query['buyerId'] = { $regex: filters.searchTerm, $options: 'i' };
                }
                else {
                    query.$or = [
                        { 'orderId._id': { $regex: filters.searchTerm, $options: 'i' } },
                        { 'buyerId.name': { $regex: filters.searchTerm, $options: 'i' } },
                        { 'sellerId.companyName': { $regex: filters.searchTerm, $options: 'i' } }
                    ];
                }
            }
            const summary = yield escrowModel_1.default.aggregate([
                { $match: query },
                {
                    $group: {
                        _id: null,
                        totalAmount: { $sum: "$totalAmount" },
                        platformFee: { $sum: "$platformFee" },
                        sellerEarnings: { $sum: "$sellerEarnings" },
                        count: { $sum: 1 }
                    }
                }
            ]);
            return summary[0] || {
                totalAmount: 0,
                platformFee: 0,
                sellerEarnings: 0,
                count: 0
            };
        });
    }
    getDashboardStats() {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const totalAuctions = yield productModal_1.default.countDocuments();
                const liveAuctions = yield productModal_1.default.countDocuments({
                    auctionStatus: 'live'
                });
                const totalSellers = yield sellerModel_1.default.countDocuments();
                const totalRevenueResult = yield adminRevenueModel_1.default.aggregate([
                    { $group: { _id: null, total: { $sum: '$revenue' } } }
                ]);
                console.log("Total Revenue Result:", totalRevenueResult);
                return {
                    totalAuctions,
                    liveAuctions,
                    totalSellers,
                    totalRevenue: ((_a = totalRevenueResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0
                };
            }
            catch (error) {
                console.error("Error in getDashboardStats:", error);
                throw new Error("Failed to getDashboardStats.");
            }
        });
    }
    getCategorySales() {
        return __awaiter(this, void 0, void 0, function* () {
            const categorySales = yield productModal_1.default.aggregate([
                { $group: {
                        _id: '$categoryId',
                        value: { $sum: '$finalBidAmount' }
                    }
                },
                { $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: '$category' },
                { $project: {
                        name: '$category.name',
                        value: 1
                    }
                }
            ]);
            return categorySales;
        });
    }
    getRevenueData(period) {
        return __awaiter(this, void 0, void 0, function* () {
            const groupStage = {
                daily: { $dateToString: { format: "%Y-%m-%d", date: { $convert: { input: "$date", to: "date" } } } },
                weekly: { $dateToString: { format: "%Y-W%V", date: { $convert: { input: "$date", to: "date" } } } },
                monthly: { $dateToString: { format: "%Y-%m", date: { $convert: { input: "$date", to: "date" } } } },
                yearly: { $dateToString: { format: "%Y", date: { $convert: { input: "$date", to: "date" } } } }
            };
            const revenueData = yield adminRevenueModel_1.default.aggregate([
                {
                    $addFields: {
                        convertedDate: { $convert: { input: "$date", to: "date" } }
                    }
                },
                {
                    $group: {
                        _id: groupStage[period],
                        revenue: { $sum: '$revenue' }
                    }
                },
                { $sort: { _id: 1 } },
                {
                    $project: {
                        date: '$_id',
                        revenue: 1,
                        _id: 0
                    }
                }
            ]);
            return revenueData;
        });
    }
    getTopSellerReports() {
        return __awaiter(this, void 0, void 0, function* () {
            const sellerReports = yield sellerModel_1.default.aggregate([
                { $lookup: {
                        from: 'products',
                        localField: '_id',
                        foreignField: 'sellerId',
                        as: 'products'
                    }
                },
                { $addFields: {
                        totalSales: { $size: '$products' },
                        revenue: { $sum: '$products.finalBidAmount' }
                    }
                },
                { $project: {
                        id: '$_id',
                        name: '$companyName',
                        totalSales: 1,
                        revenue: 1,
                        rating: { $ifNull: ['$rating', 4.5] }
                    }
                },
                { $sort: { revenue: -1 } },
                { $limit: 5 }
            ]);
            return sellerReports;
        });
    }
    getRecentEscrows() {
        return __awaiter(this, void 0, void 0, function* () {
            const recentEscrows = yield escrowModel_2.default.aggregate([
                { $lookup: {
                        from: 'sellers',
                        localField: 'sellerId',
                        foreignField: '_id',
                        as: 'seller'
                    }
                },
                { $unwind: '$seller' },
                { $project: {
                        id: '$_id',
                        orderId: '$orderId',
                        buyerId: '$buyerId',
                        sellerId: '$sellerId',
                        sellerName: '$seller.companyName',
                        totalAmount: '$totalAmount',
                        status: 1
                    }
                },
                { $sort: { createdAt: -1 } },
                { $limit: 10 }
            ]);
            return recentEscrows;
        });
    }
}
exports.default = AdminRepository;
