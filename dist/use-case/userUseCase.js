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
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserUseCase {
    constructor(_OTPgenerator, _userRepository, _mailer, _jwt, _userOTPRepo, _sellerRepository, _cloudinaryHelper, _adminRepository) {
        this._OTPgenerator = _OTPgenerator;
        this._userRepository = _userRepository;
        this._mailer = _mailer;
        this._jwt = _jwt;
        this._userOTPRepo = _userOTPRepo;
        this._sellerRepository = _sellerRepository;
        this._cloudinaryHelper = _cloudinaryHelper;
        this._adminRepository = _adminRepository;
    }
    checkIsBlock(token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this._jwt.verifyToken(token);
                if (!decoded || typeof decoded === "string") {
                    throw new Error("Invalid token");
                }
                const user = yield this._userRepository.findByEmail(decoded.email);
                return user === null || user === void 0 ? void 0 : user.isActive;
            }
            catch (error) {
                console.error("Error in checkIsBlock:", error);
                throw new Error("Error in checkIsBlock OTP");
            }
        });
    }
    sendOTP(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const OTP = this._OTPgenerator.generateOTP();
                const user = yield this._userRepository.findByEmail(email);
                if (!user) {
                    const res = yield this._mailer.sendMail(email, OTP);
                    yield this._userOTPRepo.insertOTP(email, OTP);
                    return res
                        ? { status: 200, message: "OTP sent successfully" }
                        : { status: 400, message: "Failed to send OTP, please try again" };
                }
                else {
                    return { status: 400, message: "Email already exists" };
                }
            }
            catch (error) {
                console.error("Error in sendOTP:", error);
                throw new Error("Error in sending OTP");
            }
        });
    }
    signUp(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield this._userRepository.findByEmail(userData.email);
                if (!user) {
                    const otpRecord = yield this._userOTPRepo.getOtpByEmail(userData.email);
                    if ((otpRecord === null || otpRecord === void 0 ? void 0 : otpRecord.OTP.toString()) === ((_a = userData.otp) === null || _a === void 0 ? void 0 : _a.toString())) {
                        userData.role = userData.role || "user";
                        const saltRounds = 10;
                        const hashedPass = yield bcrypt_1.default.hash(userData.password, saltRounds);
                        userData.password = hashedPass;
                        const users = yield this._userRepository.insertOne(userData);
                        const token = this._jwt.createAccessToken(userData.email, userData.role);
                        return {
                            status: 200,
                            message: "User registration successful",
                            userData: users,
                            accessToken: token
                        };
                    }
                    else {
                        return { status: 400, message: "Invalid OTP" };
                    }
                }
                else {
                    return { status: 400, message: "Email already exists" };
                }
            }
            catch (error) {
                console.error("Error in signUp:", error);
                throw new Error("Error in user sign up");
            }
        });
    }
    login(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.findByEmail(userData.email);
                if (user) {
                    if (user.isActive) {
                        return { status: 403, message: "Your account is blocked" };
                    }
                    // Proceed with password validation
                    const isPasswordValid = yield bcrypt_1.default.compare(userData.password, user.password);
                    if (isPasswordValid) {
                        const role = user.role || "user";
                        const token = this._jwt.createAccessToken(userData.email, role);
                        const refreshToken = this._jwt.createRefreshToken(userData.email, role);
                        let sellerToken;
                        let sellerId;
                        if (role === "seller") {
                            const sellerExists = yield this._sellerRepository.existsByUserId(user._id);
                            console.log(`Seller exists: ${sellerExists}`);
                            if (sellerExists) {
                                const seller = yield this._sellerRepository.existsByUserId(user._id);
                                sellerId = seller === null || seller === void 0 ? void 0 : seller._id;
                                console.log(sellerId, "this is placed on the loginj area ");
                                sellerToken = this._jwt.createAccessToken(userData.email, role);
                                console.log(`Generated sellerToken: ${sellerToken}`);
                            }
                        }
                        return {
                            status: 200,
                            accessToken: token,
                            sellerToken,
                            refreshToken,
                            sellerId,
                            message: "Login successful",
                            userData: user
                        };
                    }
                    else {
                        return { status: 400, message: "Invalid password" };
                    }
                }
                else {
                    return { status: 404, message: "User not found" };
                }
            }
            catch (error) {
                console.error("Error in login:", error);
                throw new Error("Error in user login");
            }
        });
    }
    refreshToken(refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decoded = this._jwt.verifyToken(refreshToken);
                if (!decoded || typeof decoded === "string") {
                    return { status: 403, message: "Invalid refresh token" };
                }
                const user = yield this._userRepository.findByEmail(decoded.email);
                if (!user) {
                    return { status: 404, message: "User not found" };
                }
                const newAccessToken = this._jwt.createAccessToken(decoded.email, user.role || "user");
                return { status: 200, accessToken: newAccessToken };
            }
            catch (error) {
                return { status: 500, message: "Internal server error" };
            }
        });
    }
    googleRegister(name, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._userRepository.findByEmail(email);
            const accessToken = this._jwt.createAccessToken(email, "user");
            const refreshToken = this._jwt.createRefreshToken(email, "user");
            if (user) {
                if (user.isActive) {
                    return { status: 403, message: 'Your account is blocked' };
                }
                let sellerToken;
                let sellerId;
                let role = user.role || 'user';
                if (role === 'seller') {
                    const sellerExists = yield this._sellerRepository.existsByUserId(user._id);
                    if (sellerExists) {
                        sellerToken = this._jwt.createAccessToken(user.email, role);
                    }
                }
                return {
                    status: 200,
                    accessToken: accessToken,
                    refreshToken,
                    sellerToken,
                    userData: user,
                    message: "Login successfully"
                };
            }
            else {
                const randomPassword = Math.random().toString(36).slice(-8);
                const userData = yield this._userRepository.insertOne({
                    name,
                    email,
                    password: randomPassword
                });
                if (userData) {
                    const accessToken = this._jwt.createAccessToken(userData.email, "user");
                    return {
                        status: 200,
                        accessToken: accessToken,
                        userData,
                        message: "Login successfully"
                    };
                }
                return {
                    status: 400,
                    message: "Something went wrong"
                };
            }
        });
    }
    getCategory() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const categories = yield this._adminRepository.getAllCategorys();
                console.log(categories, "categories");
                return categories;
            }
            catch (error) {
                console.error("Error fetching categories:", error);
                return null;
            }
        });
    }
    forgetPasswordReq(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.findByEmail(email);
                if (user) {
                    const role = user.role || "user";
                    const resetToken = this._jwt.createResetPasswordToken(user.email, role);
                    const forgetUrl = `${process.env.FRONTEND_URL}/forget-password/${resetToken}`;
                    const mailSent = yield this._mailer.forgetMail(email, forgetUrl);
                    if (mailSent) {
                        return {
                            status: 200,
                            message: "Password reset link sent to your email"
                        };
                    }
                    else {
                        return {
                            status: 500,
                            message: "Failed to send password reset email"
                        };
                    }
                }
                else {
                    return { status: 404, message: "User with this email does not exist" };
                }
            }
            catch (error) {
                console.error("Error in forgetPassword:", error);
                return { status: 500, message: "Internal server error" };
            }
        });
    }
    forgetPassword(token, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const decodedToken = this._jwt.verifyToken(token);
                if (!decodedToken || typeof decodedToken === "string") {
                    return { status: 400, message: "Invalid or expired token" };
                }
                const email = decodedToken.email;
                const user = yield this._userRepository.findByEmail(email);
                if (!user) {
                    return { status: 404, message: "User not found" };
                }
                // Hash the new password
                const hashedPassword = yield bcrypt_1.default.hash(password, 10);
                // Update the user's password
                const updatedUser = yield this._userRepository.updatePassword(email, hashedPassword);
                if (!updatedUser) {
                    return { status: 500, message: "Failed to update password" };
                }
                return {
                    status: 200,
                    message: "Password updated successfully",
                    userData: updatedUser
                };
            }
            catch (error) {
                console.error("Error in forgetPassword:", error);
                if (error.name === 'TokenExpiredError') {
                    return { status: 400, message: "Token has expired" };
                }
                return { status: 500, message: "Internal server error" };
            }
        });
    }
    addAddress(addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._userRepository.saveAddress(addressData);
                return result;
            }
            catch (error) {
                console.error("Error in addAddress :", error);
                return false;
            }
        });
    }
    getAddress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(userId, "userId in usecase");
                const result = yield this._userRepository.getAddress(userId);
                return result;
            }
            catch (error) {
                console.error("Error in getAddress :", error);
                return [];
            }
        });
    }
    getAllAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._userRepository.getAllAddress();
                return result;
            }
            catch (error) {
                console.error("Error in getAllAddress :", error);
                return [];
            }
        });
    }
    deleteAddress(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this._userRepository.deleteAddress(addressId);
                return result;
            }
            catch (error) {
                console.error("Error in deleteAddress :", error);
                return false;
            }
        });
    }
    updateAddress(addressId, addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedAddress = yield this._userRepository.updateAddress(addressId, addressData);
                return updatedAddress;
            }
            catch (error) {
                console.error("Error in updateAddress:", error);
                return null;
            }
        });
    }
    updateUser(userId, userData, profileImage) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (profileImage) {
                    const imageUrl = yield this._cloudinaryHelper.uploadBuffer(profileImage.buffer, "profileImages");
                    userData.profileImage = imageUrl;
                    console.log(imageUrl, "image url ");
                }
                const updatedUser = yield this._userRepository.updateUser(userId, userData);
                return updatedUser;
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw error;
            }
        });
    }
    getUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.findById(userId);
                return user;
            }
            catch (error) {
                console.error("Error fetching user:", error);
                throw error;
            }
        });
    }
    changePassword(userId, currentPassword, newPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._userRepository.findById(userId);
                if (!user) {
                    throw new Error("User not found");
                }
                console.log(user.password);
                const isMatch = yield bcrypt_1.default.compare(currentPassword, user.password);
                console.log(isMatch);
                if (!isMatch) {
                    throw new Error("Current password is incorrect");
                }
                const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
                if (user._id) {
                    const response = yield this._userRepository.changePassword(user._id, hashedPassword);
                    console.log(response, 'password changed');
                }
                else {
                    throw new Error("User ID is undefined");
                }
                return { success: true };
            }
            catch (error) {
                console.error("Error in changePassword UseCase:", error);
                return { success: false, message: error.message };
            }
        });
    }
    getUserAuctionHistory(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!userId) {
                throw new Error("User ID is required");
            }
            try {
                const auctionHistory = yield this._userRepository.getUserAuctionHistory(userId);
                console.log(auctionHistory, 'auctionHistory in usecase');
                // const enrichedHistory = await Promise.all(
                //   auctionHistory.map(async (history) => {
                //     const auctionDetails = await this._sellerRepository.getProductById(history.auctionId);
                //     console.log(auctionDetails,'this is the auction usecase',history.auctionId)
                //     return {
                //       ...history,
                //       productDetails: auctionDetails ? {
                //         image: auctionDetails.images[0],
                //         itemTitle: auctionDetails.itemTitle
                //       } : null
                //     };
                //   })
                // );
                return auctionHistory;
            }
            catch (error) {
                console.error("Error in getUserAuctionHistory use case:", error);
                throw error;
            }
        });
    }
}
exports.default = UserUseCase;
