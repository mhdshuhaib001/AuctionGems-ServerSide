import { Request, Response } from "express";
import UserUseCase from "../use-case/userUseCase";

class UserController {
  constructor(private readonly _userUseCase: UserUseCase) {}

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

  async sendOtp(req: Request, res: Response) {
    try {
      const { email } = req.body;
      console.log("Output:hallooo", email);

      const result = await this._userUseCase.sendOTP(email);
      res.status(result.status).json(result);
    } catch (error) {
      console.error("Error during OTP sending:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async logIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      console.log("Output:email and password", email, password);

      const user = await this._userUseCase.login({ email, password });
      console.log("Output:", user);

      if (user && user.accessToken) {
        return res.status(200).json(user);
      } else {
        return res.status(400).json(user);
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async googleRegister(req: Request, res: Response) {
    try {
      const { name, email, password } = req.body;
      console.log("hakoooooooooooooooooooooooooooooo", req.body);
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
}

export default UserController;
