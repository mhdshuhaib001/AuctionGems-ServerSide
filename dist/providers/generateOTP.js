"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const otplib_1 = require("otplib");
class GenerateOTP {
    generateOTP() {
        const otpString = otplib_1.authenticator.generate(otplib_1.authenticator.generateSecret()).slice(0, 4);
        const otpNumber = parseInt(otpString, 10);
        console.log('Generated OTP:', otpNumber);
        return otpNumber;
    }
}
exports.default = GenerateOTP;
