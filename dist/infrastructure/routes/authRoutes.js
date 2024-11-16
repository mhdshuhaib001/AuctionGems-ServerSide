"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const controllers_2 = require("../../providers/controllers");
const router = express_1.default.Router();
// User Auth route handler
const handleUserRegister = (req, res) => controllers_1.userController.signUp(req, res);
const handleUserOtp = (req, res) => controllers_1.userController.sendOtp(req, res);
const handleUserLogin = (req, res) => controllers_1.userController.logIn(req, res);
const handleUserGoogleAuthRegister = (req, res) => controllers_1.userController.googleRegister(req, res);
const handleAdminLogin = (req, res) => controllers_2.adminController.adminLogin(req, res);
const handleUserForegtPasswordRequest = (req, res) => controllers_1.userController.forgetPasswordReq(req, res);
const handleUserForgetPassword = (req, res) => controllers_1.userController.forgetPassword(req, res);
const handleIsBlocked = (req, res) => controllers_1.userController.checkIsBlock(req, res);
const handleTokenRefresh = (req, res) => controllers_1.userController.refreshToken(req, res);
router.post("/signup", handleUserRegister);
router.post("/send-Otp", handleUserOtp);
router.post("/login", handleUserLogin);
router.post("/refresh-token", handleTokenRefresh);
router.post("/admin-login", handleAdminLogin);
router.post("/google-auth", handleUserGoogleAuthRegister);
router.post("/forget-password-request", handleUserForegtPasswordRequest);
router.post('/forget-password', handleUserForgetPassword);
router.get("/isBlocked", handleIsBlocked);
exports.default = router;
