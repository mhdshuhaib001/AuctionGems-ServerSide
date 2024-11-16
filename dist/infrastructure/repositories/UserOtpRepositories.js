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
const userOtpModel_1 = __importDefault(require("../../entities_models/userOtpModel"));
class UserOTPRepository {
    insertOTP(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield userOtpModel_1.default.findOneAndUpdate({ email: email }, { OTP: otp, createdAt: new Date() }, { upsert: true, new: true });
                console.log('OTP insert/update result:', result);
                return true;
            }
            catch (error) {
                console.error('Error inserting OTP:', error);
                return false;
            }
        });
    }
    getOtpByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const otp = yield userOtpModel_1.default.findOne({ email: email });
                console.log('Retrieved OTP:', otp);
                return otp;
            }
            catch (error) {
                console.error('Error retrieving OTP:', error);
                return null;
            }
        });
    }
}
exports.default = UserOTPRepository;
