import { model, Schema } from "mongoose";
import OTPModel from "../interfaces/model/Otp";

const userOTPSchema = new Schema<OTPModel >({
    email: {
        type: String,
        required: true
    },
    OTP: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        required: true
    }
}, { timestamps: true })

const otpModel = model<OTPModel >('userOtp', userOTPSchema)

export default otpModel  