import IUserUseCase from "../interfaces/iUseCases/iUserUseCase";
import UserRepository from "../infrastructure/repositories/UserRepositories";
import UserOTPRepository from "../infrastructure/repositories/UserOtpRepositories";
import SellerRepository from "../infrastructure/repositories/SellerRepository";
import { Login, User } from "../interfaces/model/user";
import UserOutPut from "../interfaces/model/userOutPut";
import { AddressData } from "../interfaces/model/address";
import NodeMailer from "../providers/nodeMailer";
import GenerateOTP from "../providers/generateOTP";
import JWT from "../providers/jwt";
import bcrypt from "bcrypt";
import CloudinaryHelper from "../providers/cloudinaryHelper";
import AdminRepository from "../infrastructure/repositories/AdminRepository";
import { messaging } from "../infrastructure/config/services/fireBaseConfig";
import { IUserAuctionHistory } from "../entities_models/auctionHistory";

class UserUseCase implements IUserUseCase {
  constructor(
    private readonly _OTPgenerator: GenerateOTP,
    private readonly _userRepository: UserRepository,
    private readonly _mailer: NodeMailer,
    private readonly _jwt: JWT,
    private readonly _userOTPRepo: UserOTPRepository,
    private readonly _sellerRepository: SellerRepository,
    private readonly _cloudinaryHelper: CloudinaryHelper,
    private readonly _adminRepository: AdminRepository
  ) {}

  async checkIsBlock(token: string): Promise<boolean | undefined> {
    try {
      const decoded = this._jwt.verifyToken(token);
      if (!decoded || typeof decoded === "string") {
        throw new Error("Invalid token");
      }
      const user = await this._userRepository.findByEmail(decoded.email);

      return user?.isActive;
    } catch (error) {
      console.error("Error in checkIsBlock:", error);
      throw new Error("Error in checkIsBlock OTP");
    }
  }
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
          const saltRounds = 10;
          const hashedPass = await bcrypt.hash(userData.password, saltRounds);
          userData.password = hashedPass;
          const users = await this._userRepository.insertOne(userData);
          const token = this._jwt.createAccessToken(
            userData.email,
            userData.role
          );

          return {
            status: 200,
            message: "User registration successful",
            userData: users,
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
        if (user.isActive) {
          return { status: 403, message: "Your account is blocked" };
        }

        // Proceed with password validation
        const isPasswordValid = await bcrypt.compare(
          userData.password,
          user.password
        );
        if (isPasswordValid) {
          const role = user.role || "user";
          const token = this._jwt.createAccessToken(userData.email, role);
          
          const refreshToken = this._jwt.createRefreshToken(
            userData.email,
            role
          );
          let sellerToken: string | undefined;
          let sellerId: string | undefined;
          if (role === "seller") {
            const sellerExists = await this._sellerRepository.existsByUserId(
              user._id as string
            );
            console.log(`Seller exists: ${sellerExists}`);

            if (sellerExists) {
              const seller = await this._sellerRepository.existsByUserId(
                user._id as string
              );
              sellerId = seller?._id;
              console.log(sellerId, "this is placed on the loginj area ");
              sellerToken = this._jwt.createAccessToken(userData.email, role);

              console.log(`Generated sellerToken: ${sellerToken}`);
            }
          }
          return {
            status: 200,
            accessToken: token,
            sellerToken,
            refreshToken,
            sellerId,
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

  async refreshToken(
    refreshToken: string
  ): Promise<{ status: number; accessToken?: string; message?: string }> {
    try {
      const decoded = this._jwt.verifyToken(refreshToken);
      if (!decoded || typeof decoded === "string") {
        return { status: 403, message: "Invalid refresh token" };
      }
      const user = await this._userRepository.findByEmail(decoded.email);
      if (!user) {
        return { status: 404, message: "User not found" };
      }
      const newAccessToken = this._jwt.createAccessToken(
        decoded.email,
        user.role || "user"
      );
      return { status: 200, accessToken: newAccessToken };
    } catch (error) {
      return { status: 500, message: "Internal server error" };
    }
  }

  async googleRegister(name: string, email: string, password: string) {
    const user = await this._userRepository.findByEmail(email);
    const accessToken = this._jwt.createAccessToken(email, "user");
    const refreshToken = this._jwt.createRefreshToken(email, "user");
    if (user) {

      if(user.isActive){
        return {status:403,message:'Your account is blocked'};
      }
      let sellerToken: string|undefined;
      let sellerId :string|undefined;
      let role = user.role||'user'
      if(role==='seller'){
        const sellerExists = await this._sellerRepository.existsByUserId(user._id as string)

        if(sellerExists){
          sellerToken  = this._jwt.createAccessToken(user.email,role)

        }
      }
      return {
        status: 200,
        accessToken: accessToken,
        refreshToken,
        sellerToken,
        userData:user,
        message: "Login successfully"
      };
    } else {
      const randomPassword = Math.random().toString(36).slice(-8);
      const userData = await this._userRepository.insertOne({
        name,
        email,
        password: randomPassword
      });
      if (userData) {
        const accessToken = this._jwt.createAccessToken(userData.email, "user");
        return {
          status: 200,
          accessToken: accessToken,
          userData,
          message: "Login successfully"
        };
      }
      return {
        status: 400,
        message: "Something went wrong"
      };
    }
  }

  async getCategory(): Promise<any | null> {
    try {
      const categories = await this._adminRepository.getAllCategorys();
      console.log(categories, "categories");
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      return null;
    }
  }

  async forgetPasswordReq(email: string) {
    try {
      const user = await this._userRepository.findByEmail(email);
      if (user) {
        const role = user.role || "user";
        const resetToken = this._jwt.createResetPasswordToken(user.email, role);
        const forgetUrl = `${process.env.FRONTEND_URL}/forget-password/${resetToken}`;
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
      const decodedToken = this._jwt.verifyToken(token);
      
      if (!decodedToken || typeof decodedToken === "string") {
        return { status: 400, message: "Invalid or expired token" };
      }
  
      const email = decodedToken.email;
  
      const user = await this._userRepository.findByEmail(email);
      if (!user) {
        return { status: 404, message: "User not found" };
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Update the user's password
      const updatedUser = await this._userRepository.updatePassword(email, hashedPassword);
      if (!updatedUser) {
        return { status: 500, message: "Failed to update password" };
      }
  
      return {
        status: 200,
        message: "Password updated successfully",
        userData: updatedUser
      };
    } catch (error :any) {
      console.error("Error in forgetPassword:", error);
      
      if (error.name === 'TokenExpiredError') {
        return { status: 400, message: "Token has expired" };
      }
  
      return { status: 500, message: "Internal server error" };
    }
  }
  

  async addAddress(addressData: AddressData): Promise<boolean> {
    try {
      const result = await this._userRepository.saveAddress(addressData);
      return result;
    } catch (error) {
      console.error("Error in addAddress :", error);
      return false;
    }
  }

  async getAddress(userId: string): Promise<AddressData[]> {
    try {
      console.log(userId, "userId in usecase");
      const result = await this._userRepository.getAddress(userId);
      return result;
    } catch (error) {
      console.error("Error in getAddress :", error);
      return [];
    }
  }

  async getAllAddress(): Promise<AddressData[]> {
    try {
      const result = await this._userRepository.getAllAddress();
      return result;
    } catch (error) {
      console.error("Error in getAllAddress :", error);
      return [];
    }
  }
  async deleteAddress(addressId: string): Promise<boolean> {
    try {
      const result = await this._userRepository.deleteAddress(addressId);
      return result;
    } catch (error) {
      console.error("Error in deleteAddress :", error);
      return false;
    }
  }

  async updateAddress(
    addressId: string,
    addressData: Partial<AddressData>
  ): Promise<AddressData | null> {
    try {
      const updatedAddress = await this._userRepository.updateAddress(
        addressId,
        addressData
      );
      return updatedAddress;
    } catch (error) {
      console.error("Error in updateAddress:", error);
      return null;
    }
  }

  async updateUser(
    userId: string,
    userData: Partial<User>,
    profileImage?: Express.Multer.File
  ): Promise<User | null> {
    try {
      if (profileImage) {
        const imageUrl = await this._cloudinaryHelper.uploadBuffer(
          profileImage.buffer,
          "profileImages"
        );
        userData.profileImage = imageUrl;
        console.log(imageUrl, "image url ");
      }

      const updatedUser = await this._userRepository.updateUser(
        userId,
        userData
      );
      return updatedUser;
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }

  async getUser(userId: string): Promise<User | null> {
    try {
      const user = await this._userRepository.findById(userId);
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<any> {
    try {
      const user = await this._userRepository.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
console.log(user.password)
const isMatch = await bcrypt.compare(currentPassword, user.password);
console.log(isMatch);
      if (!isMatch) {
        throw new Error("Current password is incorrect");
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      if (user._id) {
        const response = await this._userRepository.changePassword(
          user._id,
          hashedPassword
        );
        console.log(response,'password changed')

      } else {
        throw new Error("User ID is undefined");
      }
      return { success: true };
    } catch (error: any) {
      console.error("Error in changePassword UseCase:", error);
      return { success: false, message: error.message };

      
    }
  }

  async getUserAuctionHistory(userId: string): Promise<IUserAuctionHistory[]> {
    if (!userId) {
      throw new Error("User ID is required");
    }

    try {
      const auctionHistory = await this._userRepository.getUserAuctionHistory(userId);
console.log(auctionHistory,'auctionHistory in usecase')

      // const enrichedHistory = await Promise.all(
      //   auctionHistory.map(async (history) => {
      //     const auctionDetails = await this._sellerRepository.getProductById(history.auctionId);
      //     console.log(auctionDetails,'this is the auction usecase',history.auctionId)
      //     return {
      //       ...history,
      //       productDetails: auctionDetails ? {
      //         image: auctionDetails.images[0],
      //         itemTitle: auctionDetails.itemTitle
      //       } : null
      //     };
      //   })
      // );

      return auctionHistory;
    } catch (error) {
      console.error("Error in getUserAuctionHistory use case:", error);
      throw error;
    }
  }
}

export default UserUseCase; 
