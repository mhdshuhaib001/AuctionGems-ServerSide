import IUserUseCase from "../interfaces/iUseCases/iUserUseCase";
import UserRepository from "../infrastructure/repositories/UserRepositories";
import UserOTPRepository from "../infrastructure/repositories/UserOtpRepositories";
import { Login, User } from "../interfaces/model/user";
import UserOutPut from "../interfaces/model/userOutPut";
import NodeMailer from "../providers/nodeMailer";
import GenerateOTP from "../providers/generateOTP";
import JWT from "../providers/jwt";
import bcrypt from "bcrypt";

class UserUseCase implements IUserUseCase {
  constructor(
    private readonly _OTPgenerator: GenerateOTP,
    private readonly _userRepository: UserRepository,
    private readonly _mailer: NodeMailer,
    private readonly _jwt: JWT,
    private readonly _userOTPRepo: UserOTPRepository
  ) {}

  async sendOTP(email: string): Promise<{ status: number; message: string }> {
    try {
      const OTP = this._OTPgenerator.generateOTP();
      const user = await this._userRepository.findByEmail(email);

      if (!user) {
        const res = await this._mailer.sendMail(email, OTP);
        await this._userOTPRepo.insertOTP(email, OTP);

        return res
          ? { status: 200, message: "OTP sent successfully" }
          : { status: 400, message: "Failed to send OTP, please try again" };
      } else {
        return { status: 400, message: "Email already exists" };
      }
    } catch (error) {
      console.error("Error in sendOTP:", error);
      throw new Error("Error in sending OTP");
    }
  }

  async signUp(userData: User): Promise<UserOutPut> {
    try {
      const user = await this._userRepository.findByEmail(userData.email);

      if (!user) {
        const otpRecord = await this._userOTPRepo.getOtpByEmail(userData.email);

        if (otpRecord?.OTP.toString() === userData.otp?.toString()) {
          userData.role = userData.role || "user";
          console.log(userData, "this is the userData");
          const saltRounds = 10;
          const hashedPass = await bcrypt.hash(userData.password, saltRounds);
          userData.password = hashedPass
          const users = await this._userRepository.insertOne(userData);
          const token = this._jwt.createAccessToken(
            userData.email,
            userData.role
          );
          console.log(token, "halooo");

          
          return {
            status: 200,
            message: "User registration successful",
            userData:users,
            accessToken: token
          };
        } else {
          return { status: 400, message: "Invalid OTP" };
        }
      } else {
        return { status: 400, message: "Email already exists" };
      }
    } catch (error) {
      console.error("Error in signUp:", error);
      throw new Error("Error in user sign up");
    }
  }

  async login(userData: Login): Promise<UserOutPut> {
    try {
      const user = await this._userRepository.findByEmail(userData.email);

      if (user) {
        const isPasswordValid = await bcrypt.compare(
          userData.password,
          user.password
        );
        if (isPasswordValid) {
          const role = user.role || "user";
          const token = this._jwt.createAccessToken(userData.email, role);
          console.log(token, "halooo");
          return {
            status: 200,
            accessToken: token,
            message: "Login successful",
            userData: user
          };
        } else {
          return { status: 400, message: "Invalid password" };
        }
      } else {
        return { status: 404, message: "User not found" };
      }
    } catch (error) {
      console.error("Error in login:", error);
      throw new Error("Error in user login");
    }
  }

  async googleRegister(name: string, email: string, password: string) {
    const user = await this._userRepository.findByEmail(email);
    if (user) {
      const accessToken = this._jwt.createAccessToken(email, "user");
      return {
        status: 200,
        accessToken: accessToken,
        message: "Login successfully"
      };
    } else {
      const randomPassword = Math.random().toString(36).slice(-8);
      console.log(randomPassword, "random password");
      const userData = await this._userRepository.insertOne({
        name,
        email,
        password: randomPassword,
      })

      if (userData) {
        const accessToken = this._jwt.createAccessToken(userData.email, "user");
        return {
          status: 200,
          accessToken: accessToken,
          message: "Login successfully"
        };
      }
      return {
        status: 400,
        message: "Something went wrong"
      };
    }
  }

  async forgetPasswordReq(email: string) {
    try {
      const user = await this._userRepository.findByEmail(email);
      console.log(process.env.FRONTEND_URL, "frontend usrl is this ");
      if (user) {
        const role = user.role||"user" 
        const resetToken = this._jwt.createAccessToken(user.email, role);
        const forgetUrl = `${process.env.FRONTEND_URL}/forget-password?token=${resetToken}`;
        const mailSent = await this._mailer.forgetMail(email, forgetUrl);

        if (mailSent) {
          return {
            status: 200,
            message: "Password reset link sent to your email"
          };
        } else {
          return {
            status: 500,
            message: "Failed to send password reset email"
          };
        }
      } else {
        return { status: 404, message: "User with this email does not exist" };
      }
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      return { status: 500, message: "Internal server error" };
    }
  }

  async forgetPassword(token: string, password: string): Promise<UserOutPut> {
    try {
      // Verify the token
      const decodedToken = this._jwt.verifyToken(token);
      if (!decodedToken || typeof decodedToken === "string") {
        return { status: 400, message: "Invalid or expired token" };
      }
      // Extract email or user details from decoded token
      const email = decodedToken.email; // Adjust this based on your token payload
      // Find the user
      const user = await this._userRepository.findByEmail(email);
      if (!user) {
        return { status: 404, message: "User not found" };
      }
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Update the user's password
      const updatedUser = await this._userRepository.updatePassword(
        email,
        hashedPassword
      );
      if (!updatedUser) {
        return { status: 500, message: "Failed to update password" };
      }

      return {
        status: 200,
        message: "Password updated successfully",
        userData:updatedUser
      };
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      return { status: 500, message: "Internal server error" };
    }
  }
}

export default UserUseCase;
