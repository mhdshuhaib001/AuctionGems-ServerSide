"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
const stream_1 = require("stream");
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
// Convert buffer to a readable stream
const bufferToStream = (buffer) => {
    const readable = new stream_1.Readable();
    readable.push(buffer);
    readable.push(null);
    return readable;
};
class CloudinaryHelper {
    // Upload single file using a file path
    uploadSingleFile(filePath, folder) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.upload(filePath, { folder: folder }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result === null || result === void 0 ? void 0 : result.secure_url);
            });
        });
    }
    // Upload using a file stream
    uploadStream(fileStream, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: folder }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result === null || result === void 0 ? void 0 : result.secure_url);
            });
            fileStream.pipe(uploadStream);
        });
    }
    // Upload using a buffer (converted to stream)
    uploadBuffer(fileBuffer, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: folder, timeout: 60000 }, (error, result) => {
                if (error) {
                    console.error("Cloudinary upload error:", JSON.stringify(error));
                    return reject(error);
                }
                return resolve(result === null || result === void 0 ? void 0 : result.secure_url);
            });
            const stream = bufferToStream(fileBuffer);
            stream.pipe(uploadStream)
                .on('finish', () => console.log('Upload finished'))
                .on('error', (err) => {
                console.error('Stream error:', err);
                reject(new Error('Stream error: ' + err.message));
            });
        });
    }
    // Upload multiple files (useful for bulk uploads)
    uploadMultipleFiles(filePaths, folder) {
        return Promise.all(filePaths.map(filePath => this.uploadSingleFile(filePath, folder)));
    }
    // Delete a file from Cloudinary
    deleteFile(publicId) {
        return new Promise((resolve, reject) => {
            cloudinary_1.v2.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    return reject(error);
                }
                return resolve(result);
            });
        });
    }
}
exports.default = CloudinaryHelper;
