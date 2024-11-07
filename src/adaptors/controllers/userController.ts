import { Request, Response } from "express";
import UserUseCase from "../../use-case/userUseCase";
import JWT from "../../providers/jwt";
class UserController {
  constructor(
    private readonly _userUseCase: UserUseCase,
    private _jwt: JWT
  ) {}

  async signUp(req: Request, res: Response) {
    try {
      const userData = req.body;
      const result = await this._userUseCase.signUp(userData);

      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error during sign up:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async logIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await this._userUseCase.login({ email, password });

      if (user.accessToken && user.refreshToken) {
        res.cookie("refreshToken", user.refreshToken, {
          httpOnly: true,
          secure: true,
          sameSite: "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000
        });
        return res.status(200).json(user);
      } else {
        return res.status(400).json(user);
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken)
        return res.status(403).json({ message: "No refresh token provided" });

      const result = await this._userUseCase.refreshToken(refreshToken);
      if (result.accessToken) {
        res.status(200).json({ accessToken: result.accessToken });
      } else {
        res.status(result.status).json({ message: result.message });
      }
    } catch (error) {
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async googleRegister(req: Request, res: Response) {
    try {
      const gAuthId = req.body.idToken;
      const decodedToken = this._jwt.decode(gAuthId);
      const { email, name, password } = decodedToken;
      const user = await this._userUseCase.googleRegister(
        name,
        email,
        password
      );
      res.status(user.status).json(user);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }
  async sendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const result = await this._userUseCase.sendOTP(email);
      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error during OTP sending:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async forgetPasswordReq(req: Request, res: Response) {
    try {
      const email = req.body.email;

      const result = await this._userUseCase.forgetPasswordReq(email);

      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error("Error in forgetPasswordRequest:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async forgetPassword(req: Request, res: Response) {
    try {
      console.log(req.body,'===========================================')
      const { token, newPassword } = req.body;
      const result = await this._userUseCase.forgetPassword(token, newPassword);
    } catch (error) {
      console.error("Error in forgetPassword:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async checkIsBlock(req: Request, res: Response) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res
          .status(401)
          .json({ message: "Authorization header missing" });
      }

      const token = authHeader.split(" ")[1];
      const response = await this._userUseCase.checkIsBlock(token);
      return res.status(200).json(response);
    } catch (error) {
      console.error("Error in checkIsBlock:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async addAddress(req: Request, res: Response) {
    try {
      const addressData = req.body.address;

      const result = await this._userUseCase.addAddress(addressData);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in addAddress", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAllAddress(req: Request, res: Response) {
    try {
      const result = await this._userUseCase.getAllAddress();
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAllAddress", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async getAddress(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const result = await this._userUseCase.getAddress(userId as string);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in getAddress", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const userData = req.body;
      const profileImage = req.file;

      const userId = userData.userId;
      const updateData = { ...userData };

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const result = await this._userUseCase.updateUser(
        userId,
        updateData,
        profileImage
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error updating user:", error);
      res
        .status(500)
        .json({ message: "An error occurred while updating the user" });
    }
  }
  async updateAddress(req: Request, res: Response) {
    try {
      const addressId = req.params.id;
      const addressData = req.body;
      const updatedAddress = await this._userUseCase.updateAddress(
        addressId,
        addressData
      );
      res.status(200).json(updatedAddress);
    } catch (error) {}
  }

  async deleteAddress(req: Request, res: Response) {
    try {
      const addressId = req.params.id;
      const result = await this._userUseCase.deleteAddress(addressId);
      res.status(200).json(result);
    } catch (error) {}
  }

  async getCategory(req: Request, res: Response) {
    try {
      const category = await this._userUseCase.getCategory();
      res.status(200).json(category);
    } catch (error) {
      console.error("Error fetching category:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching the category" });
    }
  }
  async getUser(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      console.log(userId, "userId", req.query);
      const user = await this._userUseCase.getUser(userId);
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res
        .status(500)
        .json({ message: "An error occurred while fetching the user" });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      console.log(req.body,'change password')
      const { userId, newPassword,currentPassword } = req.body;
      const result = await this._userUseCase.changePassword(userId, newPassword,currentPassword);

      res.status(200).json({ result});
    } catch (error) {
      console.error("Error fetching user:", error);
      res
        .status(500)
        .json({ message: "An error occurred in changePassword the user" });
    }
  }

  async notifyAuctionStart(req: Request, res: Response) {
    // try{
    //   const {auctionId,title,body} = req.body
    //   await this._userUseCase.sendAuctionNotification(auctionId,title,body)
    //   res.status(200).json({message:'Notification sent'})
    // }catch(error){
    //   console.error('Error sending auction notification:', error);
    //   res.status(500).json({ message: 'An error occurred while sending the auction notification' });
    // }
  }
}

export default UserController;
