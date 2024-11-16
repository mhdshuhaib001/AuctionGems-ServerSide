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
exports.userAuth = void 0;
const jwt_1 = __importDefault(require("../providers/jwt"));
const userAuth = (roles) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            let authHeader;
            let token;
            if (roles.includes('seller') && req.headers['sellerauthorization']) {
                authHeader = req.headers['sellerauthorization'];
            }
            else if (req.headers['userauthorization']) {
                authHeader = req.headers['userauthorization'];
            }
            if (!authHeader) {
                return res.status(401).json({ message: 'Access denied: No token provided' });
            }
            token = authHeader.split(' ')[1];
            if (!token) {
                return res.status(401).json({ message: 'Access denied: No token provided' });
            }
            const jwt = new jwt_1.default();
            let decoded = jwt.verifyToken(token);
            if (!decoded) {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken) {
                    return res.status(401).json({ message: 'Access denied: No valid token available' });
                }
                const refreshDecoded = jwt.verifyToken(refreshToken);
                if (!refreshDecoded) {
                    return res.status(403).json({ message: 'Access denied: Invalid refresh token' });
                }
                const newAccessToken = jwt.createAccessToken(refreshDecoded.email, refreshDecoded.role);
                res.cookie('accessToken', newAccessToken, { httpOnly: true, secure: true });
                decoded = jwt.verifyToken(newAccessToken);
            }
            if (!decoded || typeof decoded !== 'object' || !decoded.role) {
                return res.status(403).json({ message: 'Invalid token: Role information is missing' });
            }
            if (!roles.includes(decoded.role)) {
                return res.status(403).json({ message: 'Access denied: You do not have permission to perform this action' });
            }
            req.user = decoded;
            next();
        }
        catch (error) {
            console.error('Error in user authentication middleware:', error);
            return res.status(500).json({ message: 'An error occurred while authenticating' });
        }
    });
};
exports.userAuth = userAuth;
