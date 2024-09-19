import { Request, Response } from "express";
import UserUseCase from "../use-case/userUseCase";
import JWT from "../providers/jwt";
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

      const  gAuthId  = req.body.idToken;
      const decodedToken = this._jwt.decode(gAuthId);
      const { email, name,password } = decodedToken;
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

  async forgetPasswordReq(req: Request, res: Response) {
    try {
      const email = req.body.email;
      console.log(email, 'halooooooooooooo email is here');
      
      const result = await this._userUseCase.forgetPasswordReq(email);
  
      res.status(result.status).json({ message: result.message });
    } catch (error) {
      console.error('Error in forgetPasswordRequest:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  async forgetPassword(req:Request,res:Response){
    try {
      const {token,newPassword} = req.body
      console.log(token,newPassword,'halooooooooooooooooo')
    const result =  await this._userUseCase.forgetPassword(token,newPassword)
    console.log(result,'halooiiii')
    } catch (error) {
      console.error('Error in forgetPassword:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
  
  
}

export default UserController;
