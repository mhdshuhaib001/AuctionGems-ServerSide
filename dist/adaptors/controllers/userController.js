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
class UserController {
    constructor(_userUseCase, _jwt) {
        this._userUseCase = _userUseCase;
        this._jwt = _jwt;
    }
    signUp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const result = yield this._userUseCase.signUp(userData);
                res.status(result.status).json(result);
            }
            catch (error) {
                console.error("Error during sign up:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    logIn(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const user = yield this._userUseCase.login({ email, password });
                if (user.accessToken && user.refreshToken) {
                    res.cookie("refreshToken", user.refreshToken, {
                        httpOnly: true,
                        secure: true,
                        sameSite: "strict",
                        maxAge: 7 * 24 * 60 * 60 * 1000
                    });
                    return res.status(200).json(user);
                }
                else {
                    return res.status(400).json(user);
                }
            }
            catch (error) {
                console.error("Error:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    refreshToken(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const refreshToken = req.cookies.refreshToken;
                if (!refreshToken)
                    return res.status(403).json({ message: "No refresh token provided" });
                const result = yield this._userUseCase.refreshToken(refreshToken);
                if (result.accessToken) {
                    res.status(200).json({ accessToken: result.accessToken });
                }
                else {
                    res.status(result.status).json({ message: result.message });
                }
            }
            catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    googleRegister(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gAuthId = req.body.idToken;
                const decodedToken = this._jwt.decode(gAuthId);
                const { email, name, password } = decodedToken;
                const user = yield this._userUseCase.googleRegister(name, email, password);
                res.status(user.status).json(user);
            }
            catch (error) {
                console.log(error);
                res.status(500).json({ message: "Something went wrong" });
            }
        });
    }
    sendOtp(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                const result = yield this._userUseCase.sendOTP(email);
                res.status(result.status).json(result);
            }
            catch (error) {
                console.error("Error during OTP sending:", error);
                res.status(500).json({ error: "Internal server error" });
            }
        });
    }
    forgetPasswordReq(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const email = req.body.email;
                const result = yield this._userUseCase.forgetPasswordReq(email);
                res.status(result.status).json({ message: result.message });
            }
            catch (error) {
                console.error("Error in forgetPasswordRequest:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    forgetPassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                console.log(req.body, "000000000");
                const result = yield this._userUseCase.forgetPassword(token, newPassword);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error in forgetPassword:", error);
                res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    checkIsBlock(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authHeader = req.headers.authorization;
                if (!authHeader) {
                    return res
                        .status(401)
                        .json({ message: "Authorization header missing" });
                }
                const token = authHeader.split(" ")[1];
                const response = yield this._userUseCase.checkIsBlock(token);
                return res.status(200).json(response);
            }
            catch (error) {
                console.error("Error in checkIsBlock:", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    addAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressData = req.body.address;
                const result = yield this._userUseCase.addAddress(addressData);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error in addAddress", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    getAllAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._userUseCase.getAllAddress();
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error in getAllAddress", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    getAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const result = yield this._userUseCase.getAddress(userId);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error in getAddress", error);
                return res.status(500).json({ message: "Internal server error" });
            }
        });
    }
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userData = req.body;
                const profileImage = req.file;
                const userId = userData.userId;
                const updateData = Object.assign({}, userData);
                if (!userId) {
                    return res.status(400).json({ message: "User ID is required" });
                }
                const result = yield this._userUseCase.updateUser(userId, updateData, profileImage);
                res.status(200).json(result);
            }
            catch (error) {
                console.error("Error updating user:", error);
                res
                    .status(500)
                    .json({ message: "An error occurred while updating the user" });
            }
        });
    }
    updateAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressId = req.params.id;
                const addressData = req.body;
                const updatedAddress = yield this._userUseCase.updateAddress(addressId, addressData);
                res.status(200).json(updatedAddress);
            }
            catch (error) { }
        });
    }
    deleteAddress(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addressId = req.params.id;
                const result = yield this._userUseCase.deleteAddress(addressId);
                res.status(200).json(result);
            }
            catch (error) { }
        });
    }
    getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const category = yield this._userUseCase.getCategory();
                res.status(200).json(category);
            }
            catch (error) {
                console.error("Error fetching category:", error);
                res
                    .status(500)
                    .json({ message: "An error occurred while fetching the category" });
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                console.log(userId, "userId", req.query);
                const user = yield this._userUseCase.getUser(userId);
                res.status(200).json(user);
            }
            catch (error) {
                console.error("Error fetching user:", error);
                res
                    .status(500)
                    .json({ message: "An error occurred while fetching the user" });
            }
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(req.body, "change password");
                const { userId, newPassword, currentPassword } = req.body;
                const result = yield this._userUseCase.changePassword(userId, newPassword, currentPassword);
                res.status(200).json({ result });
            }
            catch (error) {
                console.error("Error fetching user:", error);
                res
                    .status(500)
                    .json({ message: "An error occurred in changePassword the user" });
            }
        });
    }
    notifyAuctionStart(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            // try{
            //   const {auctionId,title,body} = req.body
            //   await this._userUseCase.sendAuctionNotification(auctionId,title,body)
            //   res.status(200).json({message:'Notification sent'})
            // }catch(error){
            //   console.error('Error sending auction notification:', error);
            //   res.status(500).json({ message: 'An error occurred while sending the auction notification' });
            // }
        });
    }
    getUserAuctionHistory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.query.userId;
                console.log(userId, "this is the userId");
                if (!userId) {
                    res.status(401).json({
                        success: false,
                        message: "Unauthorized: User not authenticated"
                    });
                    return;
                }
                const auctionHistory = yield this._userUseCase.getUserAuctionHistory(userId);
                res.status(200).json({
                    success: true,
                    data: auctionHistory,
                    message: "Auction history retrieved successfully"
                });
            }
            catch (error) {
                console.error("Error fetching auction history:", error);
                res.status(500).json({
                    success: false,
                    message: "Failed to retrieve auction history"
                });
            }
        });
    }
}
exports.default = UserController;
