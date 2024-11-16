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
const addressModal_1 = __importDefault(require("../../entities_models/addressModal"));
const userModel_1 = require("../../entities_models/userModel");
const Notification_1 = __importDefault(require("../../entities_models/Notification"));
class UserRepository {
    insertOne(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("Incoming user data:", user);
                const newUser = new userModel_1.UserModel(Object.assign({}, user));
                yield newUser.save();
                console.log("User saved successfully:", newUser);
                return newUser;
            }
            catch (error) {
                console.error("Error saving user:", error);
                throw error;
            }
        });
    }
    updateUser(userId, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield userModel_1.UserModel.findByIdAndUpdate(userId, userData, {
                    new: true,
                    runValidators: true
                }).exec();
                if (!updatedUser) {
                    throw new Error("User not found");
                }
                return updatedUser;
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw error;
            }
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.UserModel.findOne({ email });
                if (!user) {
                    console.error("User not found with email:", email);
                    return null;
                }
                return user;
            }
            catch (error) {
                console.error("Error finding user by email:", error);
                throw new Error("Error finding user by email");
            }
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.UserModel.findById(id).exec();
                return user ? user.toObject() : null;
            }
            catch (error) {
                console.error("Error finding user by ID:", error);
                throw error;
            }
        });
    }
    updateRole(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userModel_1.UserModel.findById(userId).exec();
                if (user) {
                    user.role = role;
                    if (role === "seller") {
                        user.isSeller = true;
                    }
                    yield user.save();
                    return true;
                }
                return false;
            }
            catch (error) {
                console.error("Error updating user role:", error);
                return false;
            }
        });
    }
    updatePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userModel_1.UserModel.findOneAndUpdate({ email }, { $set: { password } }, { new: true });
                console.log(result, "userUpdateResult");
                return result;
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw new Error("Error updating user");
            }
        });
    }
    saveAddress(addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { fullName, phoneNumber, streetAddress, city, state, postalCode, country, userId } = addressData;
                const newAddress = new addressModal_1.default({
                    fullName,
                    phoneNumber,
                    streetAddress,
                    city,
                    state,
                    postalCode,
                    country,
                    userId
                });
                const result = yield newAddress.save();
                return result ? true : false;
            }
            catch (error) {
                console.error("Unknown error occurred", error);
                throw new Error("Unknown error occurred");
            }
        });
    }
    updateAddress(addressId, addressData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedAddress = yield addressModal_1.default.findByIdAndUpdate(addressId, addressData, { new: true, runValidators: true }).exec();
                if (!updatedAddress) {
                    throw new Error("Address not found");
                }
                return updatedAddress;
            }
            catch (error) {
                console.error("Error in updateAddress:", error);
                throw error;
            }
        });
    }
    getAllAddress() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addresses = yield addressModal_1.default.find();
                return addresses;
            }
            catch (error) {
                console.error("Error in getAllAddress:", error);
                return [];
            }
        });
    }
    getAddress(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const addresses = yield addressModal_1.default.find({ userId: userId });
                console.log(addresses, "addresses");
                return addresses;
            }
            catch (error) {
                console.error("Error in getAddressesByUserId:", error);
                return [];
            }
        });
    }
    getAddressById(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const address = yield addressModal_1.default.findById(addressId);
                return address ? address.toObject() : null;
            }
            catch (error) {
                console.error("Error in getAddressById:", error);
                return null;
            }
        });
    }
    deleteAddress(addressId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(addressId, "addressId");
                const result = yield addressModal_1.default.findByIdAndDelete({ _id: addressId });
                console.log(result, "result");
                return result ? true : false;
            }
            catch (error) {
                console.error("Error in deleteAddress:", error);
                return false;
            }
        });
    }
    saveFCMToken(userId, auctionId, fcmToken, auctionStartTime) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscription = new Notification_1.default({
                userId,
                auctionId,
                fcmToken,
                auctionStartTime
            });
            yield subscription.save();
        });
    }
    getFCMTokensByAuction(auctionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscriptions = yield Notification_1.default.find({
                auctionId
            });
            return subscriptions.map((sub) => sub.fcmToken);
        });
    }
    changePassword(userId, hashedPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield userModel_1.UserModel.updateOne({ _id: userId }, { password: hashedPassword });
                return true;
            }
            catch (error) {
                console.error("Error in changePassword:", error);
                return false;
            }
        });
    }
}
exports.default = UserRepository;
