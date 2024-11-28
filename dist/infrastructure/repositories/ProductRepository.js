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
const productModal_1 = __importDefault(require("../../entities_models/productModal"));
class ProductRepository {
    insertOne(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newProduct = new productModal_1.default(productData);
                console.log(newProduct, "this is on the newproduct on sellerusecase");
                yield newProduct.save();
                return newProduct;
            }
            catch (error) {
                console.error("Error inserting product:", error);
                throw new Error("Failed to insert product.");
            }
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield productModal_1.default.findById(productId);
                if (!result) {
                    throw new Error("Product not found");
                }
                return result;
            }
            catch (error) {
                console.error("Error fetching single product:", error);
                throw new Error("Failed to fetch product.");
            }
        });
    }
    getProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productData = yield productModal_1.default.findById(productId).populate("categoryId", "name");
                return productData;
            }
            catch (error) {
                console.error("Error fetching single product:", error);
                throw new Error("Failed to fetch product.");
            }
        });
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield productModal_1.default.find().exec();
                console.log(products, "this is the products ");
                return products;
            }
            catch (error) {
                console.error("Error fetching  product:", error);
                throw new Error("Failed to fetch product.");
            }
        });
    }
    updateAuction(auctionId, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield productModal_1.default.findByIdAndUpdate(auctionId, updateFields, { new: true }).exec();
            }
            catch (error) {
                console.error("Error update product status:", error);
                throw new Error("Failed to update product status.");
            }
        });
    }
}
exports.default = ProductRepository;
