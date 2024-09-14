import express from "express";
import { Request, Response } from "express-serve-static-core";
import { userController } from "../../providers/controllers";
import { adminController } from "../../providers/controllers";

const router = express.Router();

// User Auth route handler
const handleUserRegister = (req: Request, res: Response) =>
  userController.signUp(req, res);
const handleUserOtp = (req: Request, res: Response) =>
  userController.sendOtp(req, res);
const handleUserLogin = (req: Request, res: Response) =>
  userController.logIn(req, res);
const handleUserGoogleAuthRegister = (req: Request, res: Response) => {
  console.log("Google Auth request received:", req.body);
  userController.googleRegister(req, res);
};

const handleAdminLogin = (req: Request, res: Response) =>
  adminController.adminLogin(req, res);

router.post("/signup", handleUserRegister);
router.post("/send-Otp", handleUserOtp);
router.post("/login", handleUserLogin);
router.post("/admin-login", handleAdminLogin);
router.post("/google-auth", handleUserGoogleAuthRegister);

export default router;
