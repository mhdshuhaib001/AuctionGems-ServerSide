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
const fireBaseConfig_1 = require("../infrastructure/config/services/fireBaseConfig");
const nodeMailer_1 = __importDefault(require("../providers/nodeMailer"));
const socket_io_1 = require("../infrastructure/config/services/socket-io");
class AdminUseCase {
    constructor(_jwt, _adminRepository, _cloudinaryHelper, _sellerRepository) {
        this._jwt = _jwt;
        this._adminRepository = _adminRepository;
        this._cloudinaryHelper = _cloudinaryHelper;
        this._sellerRepository = _sellerRepository;
        this.adminEmail = process.env.ADMIN_EMAIL;
        this.adminPassword = process.env.ADMIN_PASSWORD;
    }
    adminLogin(loginData) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = loginData;
            if (email === this.adminEmail && password === this.adminPassword) {
                const token = this._jwt.createAccessToken("adminId", "admin");
                return {
                    status: 200,
                    message: "Login successful",
                    adminToken: token,
                    _id: "adminId"
                };
            }
            else {
                return {
                    status: 401,
                    message: "Invalid email or password"
                };
            }
        });
    }
    fetchAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDatas = yield this._adminRepository.getAllUsers();
                return userDatas;
            }
            catch (error) {
                console.error("Error fetching users:", error);
                throw new Error("Error fetching users");
            }
        });
    }
    updateUserActiveStatus(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId, "this is the userId ");
                const result = yield this._adminRepository.updateUserStatus(userId);
                console.log(result, "updated");
                return result;
            }
            catch (error) {
                console.error(`Error updating user status for user ${userId}:`, error);
                throw new Error(`Error updating user status for user ${userId}`);
            }
        });
    }
    addCategory(categoryData, imageFile, iconFile) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryFolder = `category/${categoryData.name}`;
                const imageUrl = (imageFile === null || imageFile === void 0 ? void 0 : imageFile.buffer)
                    ? yield this._cloudinaryHelper.uploadBuffer(imageFile.buffer, categoryFolder)
                    : "";
                const iconUrl = (iconFile === null || iconFile === void 0 ? void 0 : iconFile.buffer)
                    ? yield this._cloudinaryHelper.uploadBuffer(iconFile.buffer, categoryFolder)
                    : "";
                categoryData.imageUrl = imageUrl;
                categoryData.iconUrl = iconUrl || "";
                const category = yield this._adminRepository.addCategory(categoryData);
                return true;
            }
            catch (error) {
                console.error(`Error adding category Usecase: ${error instanceof Error ? error.message : error}`);
                return false;
            }
        });
    }
    getAllCategory(pagination) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = pagination;
                const { categories, totalCategories } = yield this._adminRepository.getAllCategory({ page, limit });
                const totalPages = Math.ceil(totalCategories / limit);
                return {
                    categories,
                    totalPages,
                    currentPage: page
                };
            }
            catch (error) {
                console.error(`Error fetching allcategory Usecase: ${error instanceof Error ? error.message : error}`);
            }
        });
    }
    updateCategory(categoryId, bodyData, files) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updateData = Object.assign({}, bodyData);
                if (files) {
                    if (files.image) {
                        const imageFile = files.image[0];
                        const imageUrl = yield this._cloudinaryHelper.uploadBuffer(imageFile.buffer, "category");
                        updateData.imageUrl = imageUrl || "";
                    }
                    if (files.icon) {
                        const iconFile = files.icon;
                        const iconUrl = yield this._cloudinaryHelper.uploadSingleFile(iconFile, "category");
                        updateData.iconUrl = iconUrl || "";
                    }
                }
                const result = yield this._adminRepository.updateCategory(categoryId, updateData);
                return result;
            }
            catch (error) {
                console.error(`Error update category Usecase: ${error instanceof Error}`);
                return false;
            }
        });
    }
    deleteCategory(categoryId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._adminRepository.deleteCategory(categoryId);
                return result;
            }
            catch (error) {
                console.error(`Error deleting category Usecase: ${error instanceof Error}`);
                return false;
            }
        });
    }
    addReport(reason, details, reportedBy, sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reportData = {
                    reason,
                    details,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                    reportedBy,
                    sellerId
                };
                console.log(reportData, "this is fro the rersponse data");
                const result = yield this._adminRepository.addReport(reportData);
                console.log("Report added successfully");
                return true;
            }
            catch (error) {
                console.error(`Error adding report: ${error instanceof Error ? error.message : error}`);
                return false;
            }
        });
    }
    subscribeToAuction(userId, auctionId, fcmToken, email, phoneNumber, countryCode) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._adminRepository.upsertNotificationPreferences(userId, auctionId, fcmToken, email, phoneNumber ? countryCode + phoneNumber : undefined);
            }
            catch (error) {
                console.error("Error in subscribeToAuction:", error);
                throw new Error("Failed to subscribe to auction notifications.");
            }
        });
    }
    sendPushNotification(fcmToken, message) {
        return __awaiter(this, void 0, void 0, function* () {
            const notificationMessage = {
                notification: {
                    title: "Auction Notification",
                    body: message
                },
                token: fcmToken
            };
            try {
                const response = yield fireBaseConfig_1.messaging.send(notificationMessage);
                console.log("Notification sent:", response);
            }
            catch (error) {
                console.error("Error sending notification:", error);
            }
        });
    }
    getReports() {
        return __awaiter(this, void 0, void 0, function* () {
            const reports = yield this._adminRepository.getReports();
            return reports;
        });
    }
    updateReportStatus(reportId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedReport = yield this._adminRepository.updateReportStatus(reportId, status);
                if (!updatedReport) {
                    console.error(`Report with ID ${reportId} not found`);
                    return { updatedReport: null, sellerBlocked: false };
                }
                let sellerBlocked = false;
                // Get seller email using the sellerId
                if (status === "warning") {
                    const seller = yield this._sellerRepository.findSeller(updatedReport.sellerId.toString());
                    if (seller) {
                        const sellerEmail = seller.userId.email;
                        const warningMessage = "Please review your actions on the platform to avoid potential penalties.";
                        const mailer = new nodeMailer_1.default();
                        const emailSent = yield mailer.sendWarningEmail(sellerEmail, warningMessage);
                        if (!emailSent) {
                            console.error("Failed to send warning email to the seller");
                        }
                        const reportDetails = `A warning has been issued regarding your recent activities. Please be cautious.`;
                        const sellerName = seller.userId.name || "Seller";
                        yield mailer.sendReportManagementEmail(sellerEmail, status, reportDetails, sellerName);
                    }
                    else {
                        console.error(`Seller with ID ${updatedReport.sellerId} not found`);
                    }
                }
                if (status === "confirmed") {
                    const reportCount = yield this._adminRepository.countConfirmedReports(updatedReport.sellerId.toString());
                    if (reportCount >= 3) {
                        yield this._adminRepository.blockSeller(updatedReport.sellerId.toString());
                        // Notify seller via socket
                        const io = (0, socket_io_1.getSocketInstance)();
                        io.emit("seller_blocked", {
                            sellerId: updatedReport.sellerId.toString(),
                            message: "Your account has been blocked due to multiple reports."
                        });
                        sellerBlocked = true;
                    }
                }
                return { updatedReport, sellerBlocked };
            }
            catch (error) {
                console.error("Error updating report status in use case:", error);
                throw new Error("Could not update report status");
            }
        });
    }
    getEscrowData(filters) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const escrowData = yield this._adminRepository.findAllEscrow(filters);
                const summary = yield this._adminRepository.getEscrowSummary(filters);
                return Object.assign(Object.assign({}, escrowData), { summary });
            }
            catch (error) {
                console.error("Error in getEscrowData:", error);
                throw new Error("Failed to fetch escrow data");
            }
        });
    }
    getDashboardData(period) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("ithe ivide ethikkn ");
                const [stats, categorySales, revenueData, sellerReports, recentEscrows] = yield Promise.all([
                    this._adminRepository.getDashboardStats(),
                    this._adminRepository.getCategorySales(),
                    this._adminRepository.getRevenueData(period),
                    this._adminRepository.getTopSellerReports(),
                    this._adminRepository.getRecentEscrows()
                ]);
                console.log(stats, categorySales, revenueData, sellerReports, recentEscrows, "this is very nice ");
                return {
                    stats,
                    categorySales,
                    revenueData,
                    sellerReports,
                    recentEscrows
                };
            }
            catch (error) {
                console.error("Error in dashbordData fetching area :", error);
                throw new Error("Failed to dashborddata  data");
            }
        });
    }
}
exports.default = AdminUseCase;
