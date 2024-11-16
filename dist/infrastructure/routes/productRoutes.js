"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const route = express_1.default.Router();
const handleGetProduct = (req, res) => controllers_1.productController.getProduct(req, res);
const handleGetProductById = (req, res) => controllers_1.productController.getProductById(req, res);
const handleFetchAllProduct = (req, res) => controllers_1.productController.getAllProducts(req, res);
route.get('/getallproduct', handleFetchAllProduct);
route.get("/:id", handleGetProduct);
route.get('/getProduct/:id', handleGetProductById);
exports.default = route;
