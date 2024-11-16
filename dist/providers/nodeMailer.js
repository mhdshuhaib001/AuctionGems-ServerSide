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
const nodemailer_1 = __importDefault(require("nodemailer"));
class NodeMailer {
    constructor() {
        const email = "muhammedshuhaib410@gmail.com";
        const password = "uzws flwu yzow bzgv";
        this._transporter = nodemailer_1.default.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: password
            }
        });
    }
    // Email verifying otp send 
    sendMail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: "AuctionGems - OTP for Email Verification",
                html: `
              <div style="font-family: Arial, sans-serif; padding: 20px;">
                  <h2 style="color: #333;">Welcome to AuctionGems!</h2>
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
                yield this._transporter.sendMail(mailOptions);
                return true;
            }
            catch (error) {
                console.error("Error sending email:", error);
                return false;
            }
        });
    }
    // Forget password area 
    forgetMail(email, forgetUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: "AuctionGems - Password Forget Request",
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
                yield this._transporter.sendMail(mailOptions);
                return true;
            }
            catch (error) {
                console.error("Error sending email:", error);
                return false;
            }
        });
    }
    // Auction Winner email
    sendWinnerMail(email, auctionName, auctionAmount, paymentLink, productImage) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: `Congratulations! You Won the Auction for ${auctionName}`,
                html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2 style="color: #333;">Congratulations, ${email.split("@")[0]}!</h2>
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
            `
            };
            try {
                yield this._transporter.sendMail(mailOptions);
                return true;
            }
            catch (error) {
                console.error("Error sending winner email:", error);
                return false;
            }
        });
    }
    // !! to send the auction starting notification
    sendAuctionStartingSoonEmail(email, productUrl, productName, price, startTime, productImage) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: `Auction Starting Soon: ${productName}`,
                html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">Get Ready! The Auction for ${productName} is Starting Soon!</h2>
          <p style="font-size: 16px;">
            Dear user, the auction for <a href="${productUrl}" style="color: blue;">${productName}</a> is about to start.
          </p>
          <p style="font-size: 16px;">Starting Price: <strong>$${price}</strong></p>
          <p style="font-size: 16px;">Starting Time: <strong>${new Date(startTime).toLocaleString()}</strong></p>
          
          <h3 style="color: #333;">Product Image:</h3>
          <a href="${productUrl}">
            <img src="${productImage}" alt="${productName}" style="width: 300px; height: auto; border-radius: 8px; margin-top: 10px;"/>
          </a>
  
          <p style="font-size: 16px;">Click the link above to view the product and participate in the auction.</p>
          <p style="font-size: 16px;">Best regards,<br/>The Auctiongems Team</p>
        </div>
      `
            };
            try {
                yield this._transporter.sendMail(mailOptions);
                return true;
            }
            catch (error) {
                console.error("Error sending auction starting soon email:", error);
                return false;
            }
        });
    }
    sendReportManagementEmail(email, reportStatus, reportDetails, sellerName) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: `Report Status Update for Your Account`,
                html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">Hello ${sellerName},</h2>
          <p style="font-size: 16px;">We wanted to update you regarding the recent report on your account.</p>
          <h3 style="color: #333;">Report Status: <strong>${reportStatus}</strong></h3>
          <p style="font-size: 16px;">Details:</p>
          <p style="font-size: 16px;">${reportDetails}</p>
          
          <p style="font-size: 16px;">If you have any questions or need further clarification, feel free to contact our support team.</p>
          <p style="font-size: 16px;">Best regards,<br/>The Auctiongems Team</p>
        </div>
      `
            };
            try {
                yield this._transporter.sendMail(mailOptions);
                console.log("Report management email sent successfully.");
                return true;
            }
            catch (error) {
                console.error("Error sending report management email:", error);
                return false;
            }
        });
    }
    sendWarningEmail(email, warningMessage) {
        return __awaiter(this, void 0, void 0, function* () {
            const mailOptions = {
                from: process.env.GMAIL,
                to: email,
                subject: "Warning Notification from Atiqgem",
                html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #ff0000;">Warning Notification</h2>
          <p style="font-size: 16px;">Dear Seller,</p>
          <p style="font-size: 16px;">${warningMessage}</p>
          <p style="font-size: 16px;">Please review your actions on the platform to avoid potential penalties.</p>
          <p style="font-size: 16px;">Best regards,<br/>The Atiqgem Team</p>
        </div>
      `
            };
            try {
                yield this._transporter.sendMail(mailOptions);
                console.log("Warning email sent successfully.");
                return true;
            }
            catch (error) {
                console.error("Error sending warning email:", error);
                return false;
            }
        });
    }
}
exports.default = NodeMailer;
