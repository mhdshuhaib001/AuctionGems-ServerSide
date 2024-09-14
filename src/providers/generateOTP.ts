import { authenticator } from 'otplib';

class GenerateOTP {
    generateOTP(): number {
        const otpString = authenticator.generate(authenticator.generateSecret()).slice(0, 4);
        const otpNumber = parseInt(otpString, 10);

        console.log('Generated OTP:', otpNumber);
        return otpNumber;
    }
}

export default GenerateOTP;
