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
class AdminController {
    constructor(_AdminUsecase) {
        this._AdminUsecase = _AdminUsecase;
        this.getEscrowData = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                // Parse query parameters
                const filters = {
                    page: Number(req.query.page) || 1,
                    limit: Number(req.query.limit) || 10,
                    status: req.query.status,
                    startDate: req.query.startDate
                        ? new Date(req.query.startDate)
                        : undefined,
                    endDate: req.query.endDate
                        ? new Date(req.query.endDate)
                        : undefined,
                    searchTerm: req.query.searchTerm
                };
                const result = yield this._AdminUsecase.getEscrowData(filters);
                res.json(result);
            }
            catch (error) {
                console.error("Error fetching escrow data:", error);
                res.status(500).json({
                    message: "Error fetching escrow data",
                    error: error.message
                });
            }
        });
    }
    adminLogin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const AdminData = req.body;
                const result = yield this._AdminUsecase.adminLogin(AdminData);
                res.status(result.status || 200).json(result);
            }
            catch (error) {
                console.error("Error during sign in:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    fetchUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this._AdminUsecase.fetchAllUsers();
                res.status(200).json(users);
            }
            catch (error) {
                console.error("Error fetching users:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    updateUserActiveStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                const result = yield this._AdminUsecase.updateUserActiveStatus(userId);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error actionhandle admin:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    addCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const files = req.files;
                if (!files) {
                    return res.status(400).json({ error: "Files are required" });
                }
                const imageFile = files["image"] ? files["image"][0] : null;
                const iconFile = files["icon"] ? files["icon"][0] : null;
                let imageUrl = null;
                let iconUrl = null;
                const categoryData = {
                    name: req.body.name,
                    imageUrl: imageUrl || "",
                    iconUrl: iconUrl || ""
                };
                const response = yield this._AdminUsecase.addCategory(categoryData, imageFile, iconFile);
                res
                    .status(201)
                    .json({ message: "Category added successfully", data: response });
            }
            catch (error) {
                console.error("Error in addCategory controller:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    getAllCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const page = Number(req.query.page) || 1;
                const limit = Number(req.query.limit) || 5;
                const categories = yield this._AdminUsecase.getAllCategory({
                    page,
                    limit
                });
                res.status(200).json(categories);
            }
            catch (error) {
                console.error("Category fetch controller error:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const updateData = Object.assign({}, req.body);
                const files = req.files;
                const updatedCategory = yield this._AdminUsecase.updateCategory(categoryId, updateData, files);
            }
            catch (error) {
                console.error("Error in controller:", error);
                res.status(500).json({ message: "Failed to update category", error });
            }
        });
    }
    deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categoryId = req.params.id;
                const result = yield this._AdminUsecase.deleteCategory(categoryId);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error in deleteCategory controller:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    // async sendWatsappNotification(req: Request, res: Response) {
    //   try {
    //     res.status(200);
    //     const { to, message } = req.body;
    //     if (!to || !message) {
    //       return res
    //         .status(400)
    //         .json({ success: false, message: "To and message are required." });
    //     }
    //     const response = this._AdminUsecase.sendWhatsAppNotificationUseCase(
    //       to,
    //       message
    //     );
    //     res.status(200).json({ success: true, message: "Notification sent!" });
    //   } catch (error) {
    //     console.error("Error in sendMessage controller:", error);
    //     res.status(500).json({ error: "Internal server error" });
    //   }
    // }
    addReport(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { reason, details, sellerId, reportedBy } = req.body;
                const response = yield this._AdminUsecase.addReport(reason, details, reportedBy, sellerId);
                console.log("Report added successfully");
                res.status(201).json(response);
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ error: "Failed to add report" });
            }
        });
    }
    auctionNotification(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { auctionId, userId, fcmToken, email, phoneNumber, countryCode } = req.body;
                yield this._AdminUsecase.subscribeToAuction(userId, auctionId, fcmToken, email, phoneNumber, countryCode);
                res.status(200).json({ message: "Notification sent" });
            }
            catch (error) {
                console.error("Error sending auction notification:", error);
                res.status(500).json({
                    message: "An error occurred while sending the auction notification"
                });
            }
        });
    }
    getReports(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const reports = yield this._AdminUsecase.getReports();
                res.status(201).json(reports);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to get reports" });
            }
        });
    }
    updateReportStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, req.params);
                const status = req.body.status;
                const reportId = req.params.id;
                const { updatedReport, sellerBlocked } = yield this._AdminUsecase.updateReportStatus(reportId, status);
                if (!updatedReport) {
                    return res.status(404).json({ message: "Report not found" });
                }
                const message = sellerBlocked
                    ? "Report status updated, seller has been blocked due to repeated reports."
                    : "Report status updated successfully.";
                return res.status(200).json({ message });
            }
            catch (error) {
                console.error("Error updating report status in controller:", error);
                return res.status(500).json({
                    message: "An error occurred while updating the report status."
                });
            }
        });
    }
    getDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("haloooooo");
                const period = req.query.period || "weekly";
                const dashboardData = yield this._AdminUsecase.getDashboardData(period);
                res.status(200).json({
                    success: true,
                    data: dashboardData
                });
            }
            catch (error) {
                return {
                    success: false,
                    message: "Failed to fetch dashboard data"
                };
            }
        });
    }
}
exports.default = AdminController;
