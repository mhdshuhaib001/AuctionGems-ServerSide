import otp from "../../interfaces/model/Otp";
import otpModel from "../../entities_models/userOtpModel";
import IOTPRepository from "../../interfaces/iRepositories/iOtpRepository";

class UserOTPRepository implements IOTPRepository {

    async insertOTP(email: string, otp: number): Promise<boolean> {
        try {
            const result = await otpModel.findOneAndUpdate(
                { email: email },
                { OTP: otp, createdAt: new Date() },
                { upsert: true, new: true }
            );
            console.log('OTP insert/update result:', result);
            return true;
        } catch (error) {
            console.error('Error inserting OTP:', error);
            return false;
        }
    }

    async getOtpByEmail(email: string): Promise<otp | null> {
        try {
            const otp = await otpModel.findOne({ email: email });
            console.log('Retrieved OTP:', otp);
            return otp;
        } catch (error) {
            console.error('Error retrieving OTP:', error);
            return null;
        }
    }

}

export default UserOTPRepository;
