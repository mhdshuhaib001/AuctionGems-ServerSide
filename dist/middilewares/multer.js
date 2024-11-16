"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFields = exports.uploadMultipleImages = exports.uploadSingleImage = void 0;
const multer_1 = __importDefault(require("multer"));
// Set up Multer to store files in memory
const storage = multer_1.default.memoryStorage();
// Middleware to handle a single image
const uploadSingleImage = (0, multer_1.default)({ storage: storage }).single('image');
exports.uploadSingleImage = uploadSingleImage;
// Middleware to handle multiple images (up to 5)
const uploadMultipleImages = (0, multer_1.default)({ storage: storage }).array('images', 5);
exports.uploadMultipleImages = uploadMultipleImages;
const uploadFields = (0, multer_1.default)({ storage: storage }).fields([
    { name: 'image', maxCount: 1 },
    { name: 'icon', maxCount: 1 }
]);
exports.uploadFields = uploadFields;
