"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const dotenv_1 = __importDefault(require("dotenv"));
const jwt_decode_1 = require("jwt-decode");
dotenv_1.default.config();
class JWT {
    constructor() {
        this._secretKey = process.env.JWT_KEY;
        this._refreshSecretKey = process.env.JWT_KEY;
    }
    createAccessToken(email, role) {
        if (!this._secretKey) {
            throw new Error('Secret key is undefined');
        }
        const payload = { email, role };
        return (0, jsonwebtoken_1.sign)(payload, this._secretKey, { expiresIn: '24h' });
    }
    createResetPasswordToken(email, role) {
        if (!this._secretKey) {
            throw new Error('Secret key is undefined');
        }
        const payload = { email, role };
        return (0, jsonwebtoken_1.sign)(payload, this._secretKey, { expiresIn: '1h' });
    }
    createRefreshToken(email, role) {
        if (!this._refreshSecretKey) {
            throw new Error('Refresh secret key is undefined');
        }
        const payload = { email, role };
        return (0, jsonwebtoken_1.sign)(payload, this._refreshSecretKey, { expiresIn: '7d' });
    }
    verifyToken(token, isRefreshToken = false) {
        try {
            const key = isRefreshToken ? this._refreshSecretKey : this._secretKey;
            if (!key) {
                throw new Error('Secret key is undefined');
            }
            return (0, jsonwebtoken_1.verify)(token, key);
        }
        catch (error) {
            console.error('JWT Verification Error:', error);
            return null;
        }
    }
    decode(token) {
        try {
            const decode = (0, jwt_decode_1.jwtDecode)(token);
            return decode;
        }
        catch (error) {
            console.error("JWT Decode Error:", error);
            return null;
        }
    }
}
exports.default = JWT;
