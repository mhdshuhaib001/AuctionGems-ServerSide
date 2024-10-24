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
          subject: 'Atiqgem - OTP for Email Verification',
          html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2 style="color: #333;">Welcome to Atiqgem!</h2>
                  <p style="font-size: 16px;">Thank you for signing up. Please verify your email address by using the OTP below:</p>
                  <h3 style="background-color: #f2f2f2; padding: 10px; border-radius: 5px; display: inline-block; font-size: 24px; color: #555;">
                      ${otp}
                  </h3>
                  <p style="font-size: 16px;">This OTP is valid for 5 minutes. If you did not request this, please ignore this email.</p>
                  <p style="font-size: 16px;">Best regards,<br/>The Atiqgem Team</p>
              </div>
          `
      };
  
      try {
          await this._transporter.sendMail(mailOptions);
          return true;
      } catch (error) {
          console.error('Error sending email:', error);
          return false;
      }
  }
  


    async forgetMail(email: string, forgetUrl: string): Promise<boolean> {
        const mailOptions = {
          from: process.env.GMAIL,
          to: email,
          subject: 'Antigo - Password Forget Request',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #f0f0f0; border-radius: 10px;">
              <h2 style="text-align: center; color: #2c3e50;">Antigo - Password Reset</h2>
              <p style="font-size: 16px; color: #2c3e50;">
                Hello,
              </p>
              <p style="font-size: 16px; color: #2c3e50;">
                We received a request to reset the password for your Antigo account. Please click the button below to reset your password. This link will expire in 1 hour.
              </p>
              <div style="text-align: center; margin-top: 20px;">
                <a href="${forgetUrl}" style="background-color: #3498db; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">Forget Password</a>
              </div>
              <p style="font-size: 16px; color: #2c3e50; margin-top: 20px;">
                If you did not request this password reset, please ignore this email. Your password will remain unchanged.
              </p>
              <p style="font-size: 16px; color: #2c3e50;">
                Regards,<br/>The Antigo Team
              </p>
            </div>
          `
        };
      
        try {
          await this._transporter.sendMail(mailOptions);
          return true;
        } catch (error) {
          console.error('Error sending email:', error);
          return false;
        }
      }
      

      async sendWinnerMail(email: string, auctionName: string, auctionAmount: number, paymentLink: string, productImage: string): Promise<boolean> {
        const mailOptions = {
            from: process.env.GMAIL,
            to: email,
            subject: `Congratulations! You Won the Auction for ${auctionName}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #333;">Congratulations, ${email.split('@')[0]}!</h2>
                    <p style="font-size: 16px;">You've won the auction for <strong>${auctionName}</strong>!</p>
                    <h3 style="color: #333;">Bid Information</h3>
                    <p style="font-size: 16px;">Bid Amount: <strong>$${auctionAmount.toFixed(2)}</strong></p>
                    <p style="font-size: 16px;">Next Steps:</p>
                    <ul>
                        <li><strong>Payment:</strong> Please proceed with payment to complete the transaction. <a href="${paymentLink}" style="color: blue;">Pay Now</a></li>
                        <li><strong>Shipping:</strong> Arrange for shipping or pick-up details.</li>
                        <li><strong>Contact:</strong> For any queries, contact <a href="mailto:support@auctiongems.com">support@auctiongems.com</a>.</li>
                    </ul>
                    <h3 style="color: #333;">Product Image:</h3>
                    <img src="${productImage}" alt="${auctionName}" style="width: 300px; height: auto;"/>
                    <p style="font-size: 16px;">Thank you for participating in our auction!</p>
                    <p style="font-size: 16px;">Best regards,<br/>The Antigo Team</p>
                </div>
            `,
        };
    
        try {
            await this._transporter.sendMail(mailOptions);
            return true;
        } catch (error) {
            console.error('Error sending winner email:', error);
            return false;
        }
    }
    
      
}

export default NodeMailer;
    