"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const mongoose_1 = __importStar(require("mongoose"));
class SellerUseCase {
    constructor(_SellerRepository, _UserRepository, _jwt, _ProductRepository, _AdminRepository, _cloudinaryHelper) {
        this._SellerRepository = _SellerRepository;
        this._UserRepository = _UserRepository;
        this._jwt = _jwt;
        this._ProductRepository = _ProductRepository;
        this._AdminRepository = _AdminRepository;
        this._cloudinaryHelper = _cloudinaryHelper;
    }
    createSeller(sellerData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingName = yield this._SellerRepository.findByName(sellerData.companyName);
                if (existingName) {
                    return {
                        status: 400,
                        message: "Seller name already taken"
                    };
                }
                const result = yield this._SellerRepository.insertOne(sellerData);
                yield this._UserRepository.updateRole(sellerData.userId.toString(), "seller");
                const sellerToken = this._jwt.createAccessToken(sellerData.userId.toString(), "seller");
                return {
                    status: 202,
                    message: "Seller created successfully",
                    sellerData: sellerData,
                    sellerId: result._id,
                    sellerToken
                };
            }
            catch (error) {
                console.error("Error creating seller:", error);
                throw new Error("Failed to create seller.");
            }
        });
    }
    updateSeller(sellerData, image) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let imageUrl = null;
                // Check if the seller exists
                const sellerExists = yield this._SellerRepository.existsBySellerId(sellerData._id);
                if (!sellerExists) {
                    return {
                        status: 404,
                        message: "Seller not found"
                    };
                }
                if (image) {
                    console.log("Starting upload to Cloudinary...");
                    try {
                        imageUrl = yield this._cloudinaryHelper.uploadBuffer(image.buffer, "seller_images");
                    }
                    catch (uploadError) {
                        console.error("Image upload failed:", uploadError);
                        return {
                            status: 500,
                            message: "Failed to upload image"
                        };
                    }
                }
                else {
                    console.log("No image provided, skipping upload.");
                }
                // Prepare the updated seller data
                const updatedSellerData = Object.assign(Object.assign({}, sellerData), { profile: imageUrl ? imageUrl : sellerData.profile });
                // Update seller information in the repository
                const updateResponse = yield this._SellerRepository.updateSeller(sellerData._id, updatedSellerData);
                console.log("Update Response:", updateResponse);
                return {
                    status: 200,
                    message: "Seller updated successfully",
                    data: updateResponse
                };
            }
            catch (error) {
                console.error("Error updating seller:", error);
                return {
                    status: 500,
                    message: "Failed to update seller"
                };
            }
        });
    }
    createProduct(productData, images) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!Array.isArray(images) || images.length === 0) {
                    throw new Error("No images provided");
                }
                const uploadPromise = images.map((imageBuffer) => this._cloudinaryHelper.uploadBuffer(imageBuffer, "auction_gems/product_images"));
                const imageUrl = yield Promise.all(uploadPromise);
                const updatedProductData = Object.assign(Object.assign({}, productData), { images: imageUrl });
                const currentTime = new Date();
                if (productData.auctionFormat === "auction") {
                    if (new Date(productData.auctionStartDateTime) > currentTime) {
                        updatedProductData.auctionStatus = "upcoming";
                    }
                    else {
                        updatedProductData.auctionStatus = "live";
                    }
                }
                else {
                    updatedProductData.auctionStatus = "live";
                }
                const product = yield this._ProductRepository.insertOne(updatedProductData);
                return {
                    status: 201,
                    message: "Product created successfully",
                    productData: product
                };
            }
            catch (error) {
                console.error("Error creating product:", error);
                throw new Error("Failed to create product.");
            }
        });
    }
    fetchSellerProducts(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this._SellerRepository.getAllProducts(sellerId);
                if (products.length > 0) {
                    const productsWithCategory = products.map((product) => {
                        const plainProduct = product.toObject();
                        plainProduct.category = plainProduct.categoryId || {
                            id: null,
                            name: "Unknown Category"
                        };
                        delete plainProduct.categoryId;
                        return plainProduct;
                    });
                    return {
                        status: 200,
                        message: "Products fetched successfully",
                        products: productsWithCategory
                    };
                }
                return {
                    status: 404,
                    message: "No products found for this seller"
                };
            }
            catch (error) {
                console.error("Error fetching products:", error);
                return {
                    status: 500,
                    message: "Failed to fetch products"
                };
            }
        });
    }
    deleteProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this._SellerRepository.deleteProduct(productId);
                return {
                    status: 200,
                    message: "Product deleted successfully"
                };
            }
            catch (error) {
                console.error("Error deleting product:", error);
                return {
                    status: 500,
                    message: "Failed to delete product"
                };
            }
        });
    }
    getProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this._SellerRepository.getProductById(productId);
                if (!product) {
                    return {
                        status: 404,
                        message: "Product not found"
                    };
                }
                return {
                    status: 200,
                    message: "Product fetched successfully",
                    productData: product
                };
            }
            catch (error) {
                console.error("Error getting product:", error);
                throw new Error("Failed to get product.");
            }
        });
    }
    getAllProducts(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this._SellerRepository.getAll(page, limit);
                return {
                    status: 200,
                    message: "All products fetched successfully",
                    products
                };
            }
            catch (error) {
                console.error("Error fetching all products:", error);
                return {
                    status: 500,
                    message: "Failed to fetch products"
                };
            }
        });
    }
    fetchSeller(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("suiiiii");
                const seller = yield this._SellerRepository.findById(sellerId);
                if (!seller) {
                    return {
                        status: 404,
                        message: "Seller not found"
                    };
                }
                return {
                    status: 200,
                    message: "Seller fetched successfully",
                    seller
                };
            }
            catch (error) {
                console.error("Error fetching seller:", error);
                return {
                    status: 500,
                    message: "Failed to fetch seller"
                };
            }
        });
    }
    getAllOrders(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const orders = yield this._SellerRepository.getAllOrders(sellerId);
                // const ordersWithDetails = await Promise.all(
                //   orders.map(async (order: { productId: string; buyerId: string }) => {
                //     const product = await this._ProductRepository.getProductById(
                //       order.productId
                //     );
                //     const buyer = await this._UserRepository.findById(order.buyerId);
                //     return {
                //       ...order,
                //       productName: product?.itemTitle,
                //       buyerName: buyer ? buyer.name : "Unknown"
                //     };
                //   })
                // );
                return {
                    status: 200,
                    message: "Orders fetched successfully",
                    orders: orders
                };
            }
            catch (error) {
                console.error("Error fetching orders:", error);
                return {
                    status: 500,
                    message: "Failed to fetch orders"
                };
            }
        });
    }
    fetchAllSeller() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("fetch all seller ");
            const sellerDatas = yield this._SellerRepository.getAllSeller();
            return sellerDatas;
        });
    }
    updateOrderStatus(orderId, newStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedOrder = yield this._SellerRepository.updateOrderStatus(orderId, newStatus);
                console.log(updatedOrder, "updatedOrder");
                return {
                    status: 200,
                    message: "Order status updated successfully",
                    order: updatedOrder
                };
            }
            catch (error) {
                console.error("Error updating order status:", error);
                return {
                    status: 500,
                    message: "Failed to update order status"
                };
            }
        });
    }
    createReview(sellerId, userId, rating, comment) {
        return __awaiter(this, void 0, void 0, function* () {
            const reviewData = {
                sellerId: new mongoose_1.default.Types.ObjectId(sellerId),
                user: new mongoose_1.default.Types.ObjectId(userId),
                rating,
                comment
            };
            try {
                const newReview = yield this._SellerRepository.addReview(reviewData);
                return {
                    status: 201,
                    message: "Review added successfully",
                    review: newReview
                };
            }
            catch (error) {
                console.error("Failed to add review:", error);
                return {
                    status: 500,
                    message: "Failed to add review"
                };
            }
        });
    }
    // async getReviews(sellerId: string): Promise<IReview[]> {
    //   try {
    //     console.log(sellerId, "sellerId in the review area");
    //     const response = await this._SellerRepository.getReview(sellerId);
    //     return response;
    //   } catch (error) {
    //     console.error("Error fetching review data:", error);
    //     throw new Error(`Failed to get review data: `);
    //   }
    // }
    fetchFullSellerProfile(sellerId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const sellerProfile = yield this._SellerRepository.findSeller(sellerId);
                if (!sellerProfile) {
                    throw new Error("Seller not found");
                }
                const sellerProducts = yield this._SellerRepository.getAllProducts(sellerId);
                const sellerReviews = yield this._SellerRepository.findReviewsBySellerId(sellerId);
                return { sellerProfile, sellerProducts, sellerReviews };
            }
            catch (error) {
                console.error("Error fetching full seller profile:", error);
                throw new Error(`Failed to fetch seller profile: `);
            }
        });
    }
    execute(sellerId, timeframe) {
        return __awaiter(this, void 0, void 0, function* () {
            const sellerObjectId = new mongoose_1.Types.ObjectId(sellerId);
            const [metrics, salesData, categoryDistribution] = yield Promise.all([
                this._SellerRepository.getSellerMetrics(sellerObjectId),
                this._SellerRepository.getSalesData(sellerObjectId, timeframe),
                this._SellerRepository.getCategoryDistribution(sellerObjectId)
            ]);
            return {
                metrics,
                salesData: {
                    daily: timeframe === 'daily' ? salesData : [],
                    weekly: timeframe === 'weekly' ? salesData : [],
                    monthly: timeframe === 'monthly' ? salesData : [],
                    yearly: timeframe === 'yearly' ? salesData : []
                },
                categoryDistribution
            };
        });
    }
}
exports.default = SellerUseCase;
