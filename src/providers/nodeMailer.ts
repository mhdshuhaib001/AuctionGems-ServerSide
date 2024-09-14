import nodemailer from 'nodemailer';
import mailer from '../interfaces/model/nodeMailer';

class NodeMailer implements mailer {
    private readonly _transporter: nodemailer.Transporter;

    constructor() {
        const email = "muhammedshuhaib410@gmail.com";
        const password = "uzws flwu yzow bzgv"  ;

        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: email,
                pass: password
            }
        });
    }

    async sendMail(email: string, otp: number): Promise<boolean> {
        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: 'Atiqgem \n OTP for email verification',
            text: `Your OTP is: ${otp}`
        };

        try {
            await this._transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending email:', error);
            return false;
        }
    }
}

export default NodeMailer;
    