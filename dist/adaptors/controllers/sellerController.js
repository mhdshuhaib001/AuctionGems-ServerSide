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
class SellerController {
    constructor(_sellerUseCase) {
        this._sellerUseCase = _sellerUseCase;
    }
    createSeller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerData = req.body;
                const result = yield this._sellerUseCase.createSeller(sellerData);
                res.status(result.status).json(result);
            }
            catch (error) { }
        });
    }
    createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productData = req.body;
                console.log(productData, '0000000000000000000000000000000000000000000000');
                const sellerId = req.body.sellerId;
                const imagesFile = req.files;
                // Process images and convert to buffers if storing directly in DB
                const images = imagesFile.map((file) => file.buffer);
                const result = yield this._sellerUseCase.createProduct(productData, images);
                res
                    .status(result.status)
                    .json({ message: result.message, productData: result.productData });
            }
            catch (error) {
                console.error("Error creating product:", error);
                res.status(500).json({ message: "Error creating product." });
            }
        });
    }
    updateSeller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "req.body--------------------");
                console.log(req.file, "req.file--------------------");
                const sellerData = req.body;
                const image = req.file || null;
                const response = yield this._sellerUseCase.updateSeller(sellerData, image);
                // Send the full response back to the client
                res.status(response.status).json(response);
            }
            catch (error) {
                console.error("Error updateSeller.", error);
                // Handle error response correctly
                res.status(500).json({ message: "Error updateSeller." });
            }
        });
    }
    fetchSellerProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.params.sellerId;
                const products = yield this._sellerUseCase.fetchSellerProducts(sellerId);
                res.status(products.status).json(products);
            }
            catch (error) {
                console.error("Error product:", error);
                res.status(500).json({ message: "Error creating product." });
            }
        });
    }
    deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = req.params.productId;
                console.log(productId, "controllers productId ");
                const response = yield this._sellerUseCase.deleteProduct(productId);
                res.status(response.status).json({ response });
            }
            catch (error) {
                console.error("Error product:", error);
                res.status(500).json({ message: "Error product removeing time." });
            }
        });
    }
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page = 1, limit = 10 } = req.query;
            const pageNumber = parseInt(page, 10) || 1;
            const limitNumber = parseInt(limit, 10) || 10;
            try {
                const products = yield this._sellerUseCase.getAllProducts(pageNumber, limitNumber);
                res.status(200).json(products);
            }
            catch (error) {
                console.error("Error fetching products:", error);
                res.status(500).json({ message: "Error fetching products." });
            }
        });
    }
    fetchSeller(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.params.sellerId;
                const response = yield this._sellerUseCase.fetchSeller(sellerId);
                return res.status(response.status).json(response);
            }
            catch (error) {
                console.error("Error fetching seller:", error);
                return res
                    .status(500)
                    .json({ message: "An error occurred while fetching the seller" });
            }
        });
    }
    getAllOrders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.params.sellerId;
                const response = yield this._sellerUseCase.getAllOrders(sellerId);
                return res.status(response.status).json(response);
            }
            catch (error) {
                console.error("Error fetching orders:", error);
                return res
                    .status(500)
                    .json({ message: "An error occurred while fetching the orders" });
            }
        });
    }
    updateOrderStatus(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orderId = req.params.orderId;
                const newStatus = req.body.status;
                const response = yield this._sellerUseCase.updateOrderStatus(orderId, newStatus);
                return res.status(response.status).json(response);
            }
            catch (error) {
                console.error("Error updating order status:", error);
                return res.status(500).json({ message: "Failed to update order status" });
            }
        });
    }
    fetchAllSellers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield this._sellerUseCase.fetchAllSeller();
                return res.status(200).json(response);
            }
            catch (error) {
                console.log('fetch All seller');
                return res.status(500).json({ message: "Failed to fetch all seller" });
            }
        });
    }
    createReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sellerId, userId, rating, comment } = req.body;
                const response = yield this._sellerUseCase.createReview(sellerId, userId, rating, comment);
                return res.status(200).json(response);
            }
            catch (error) {
                return res.status(500).json({ message: "Failed to create review" });
            }
        });
    }
    getReview(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.params.sellerId;
                const result = yield this._sellerUseCase.fetchFullSellerProfile(sellerId);
                return res.status(200).json({ result, message: 'review send successfully' });
            }
            catch (error) {
                console.error('Error fetching reviews:', error);
                return res.status(500).json({ message: 'Failed to fetch reviews' });
            }
        });
    }
    fetchFullSellerProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerId = req.params.sellerId;
                const data = yield this._sellerUseCase.fetchFullSellerProfile(sellerId);
                if (!data.sellerProfile) {
                    return res.status(404).json({ message: "Seller not found" });
                }
                res.status(200).json({
                    status: 200,
                    message: "Seller profile fetched successfully",
                    data,
                });
            }
            catch (error) {
                console.error("Error fetching seller profile:", error);
                res.status(500).json({ message: "Error fetching seller profile" });
            }
        });
    }
    getDashboardData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { sellerId } = req.params;
                const { timeframe = 'monthly' } = req.query;
                const dashboardData = yield this._sellerUseCase.execute(sellerId, timeframe);
                res.status(200).json({
                    success: true,
                    data: dashboardData
                });
            }
            catch (error) {
                res.status(500).json({
                    success: false,
                    message: 'Error fetching dashboard data',
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        });
    }
}
exports.default = SellerController;
