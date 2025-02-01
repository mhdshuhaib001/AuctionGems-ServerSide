import OTPModel from "../model/Otp";

interface IOTPRepository{
    insertOTP(email:string,otp:number): Promise<boolean>
    getOtpByEmail(email:string) : Promise<OTPModel | null>

}

export default IOTPRepository