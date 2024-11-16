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
const Notification_1 = __importDefault(require("../../entities_models/Notification"));
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
            yield sellerModel_1.default.findByIdAndUpdate(sellerId, { status: "blocked" });
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
}
exports.default = AdminRepository;
