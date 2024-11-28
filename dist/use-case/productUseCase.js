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
class ProductUseCase {
    constructor(_ProductRepository, _sellerRepository) {
        this._ProductRepository = _ProductRepository;
        this._sellerRepository = _sellerRepository;
    }
    getProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = yield this._ProductRepository.getProductById(productId);
                console.log(product, "product");
                if (!product) {
                    return {
                        status: 404,
                        message: "Product not found"
                    };
                }
                const sellerId = product.sellerId.toString();
                const seller = yield this._sellerRepository.findById(sellerId);
                const sellerData = {
                    sellerId: sellerId,
                    companyName: seller === null || seller === void 0 ? void 0 : seller.companyName,
                    address: seller === null || seller === void 0 ? void 0 : seller.address,
                    phone: seller === null || seller === void 0 ? void 0 : seller.phone,
                    profile: seller === null || seller === void 0 ? void 0 : seller.profile
                };
                console.log(sellerData, "sellerData");
                return {
                    status: 200,
                    message: "Product fetched successfully",
                    productData: product,
                    sellerData: sellerData
                };
            }
            catch (error) {
                console.error("Error getting product:", error);
                throw new Error("Failed to get product.");
            }
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const productData = yield this._ProductRepository.getProduct(productId);
            console.log(productData, "this is the productData");
            if (!productData) {
                throw new Error("Product not found");
            }
            return productData;
        });
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this._ProductRepository.findAll();
                return {
                    status: "200",
                    message: "All products fetched successfully",
                    products
                };
            }
            catch (error) {
                return {
                    status: "error",
                    message: "Failed to fetch products"
                };
            }
        });
    }
    updateAuctionStatus(auctionId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const validStatuses = ["sold", "live", "upcoming", "relisted", "end", "unsold"];
                if (!validStatuses.includes(status)) {
                    throw new Error("Invalid auction status");
                }
                const auction = yield this._ProductRepository.getProductById(auctionId);
                if (!auction) {
                    throw new Error("Auction not found");
                }
                if (auction.auctionStatus === "sold" || auction.auctionStatus === "relisted") {
                    console.log("Cannot update status for sold or relisted auctions.");
                    return;
                }
                // auction.auctionStatus = status;
                // await this._ProductRepository.updateAuction(auctionId, { auctionStatus: status });
            }
            catch (error) {
            }
        });
    }
}
exports.default = ProductUseCase;
