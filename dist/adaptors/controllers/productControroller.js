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
class ProductController {
    constructor(_productUseCase) {
        this._productUseCase = _productUseCase;
    }
    getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = req.params.id;
                const product = yield this._productUseCase.getProduct(productId);
                res.status(product.status).json(product);
            }
            catch (error) {
                console.error("Error fetching product:", error);
                res.status(500).json({ message: "Error retrieving product." });
            }
        });
    }
    getProductById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = req.params.id;
                const productData = yield this._productUseCase.getProductById(productId);
                if (!productData) {
                    return res.status(404).json({ message: "Product not found" });
                }
                return res.status(200).json(productData);
            }
            catch (error) {
                console.error("Error fetching product:", error);
                return res.status(500).json({ message: "Failed to fetch product" });
            }
        });
    }
    getAllProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const products = yield this._productUseCase.getProducts();
                res.status(200).json(products);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to fetch products" });
            }
        });
    }
}
exports.default = ProductController;
