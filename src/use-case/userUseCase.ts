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

          const users = await this._userRepository.insertOne(userData);
          const token = this._jwt.createAccessToken(
            userData._id,
            userData.role
          );
          console.log(token, "halooo");

          const responseUserData = {
            _id: users._id,
            email: users.email,
            name: users.name,
            role: users.role
          };
          console.log(responseUserData, "this is response data");
          return {
            status: 200,
            message: "User registration successful",
            userData: responseUserData,
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
          const token = this._jwt.createAccessToken(user._id, role);
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
      const accessToken = this._jwt.createAccessToken(user._id, "user");
      return {
        status: 200,
        accessToken: accessToken,
        message: "Login successfully"
      };
    } else {
      const userData: User = await this._userRepository.insertOne({
        name,
        email,
        password,
        _id: "",
        isActive: true,
        isSeller: false
      });

      if (userData) {
        const accessToken = this._jwt.createAccessToken(userData._id, "user");
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
}

export default UserUseCase;
