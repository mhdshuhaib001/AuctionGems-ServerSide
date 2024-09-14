import Otp from '../model/OTP'


interface IOTPRepository{
    insertOTP(email:string,otp:number): Promise<boolean>
    getOtpByEmail(email:string) : Promise<Otp | null>

}

export default IOTPRepository