import mongoose from "mongoose";
import { Category, Login, Pagination } from "../model/admin";
import AdminOutPut from "../model/adminOutput";

interface IAdminUseCase {
  adminLogin(loginData: Login): Promise<AdminOutPut>;
  fetchAllUsers(): Promise<any>;
  updateUserActiveStatus(userId: string): Promise<any>;
  addCategory(
      categoryData: Category,
      imageFile: Express.Multer.File | null,
      iconFile: Express.Multer.File | null   
  ): Promise<boolean>;
  getAllCategory(pagination: Pagination): Promise<any>
  updateCategory(
    categoryId: string,
    bodyData: any,
    files: any
  ): Promise<boolean> 
  deleteCategory(categoryId: string): Promise<boolean>
  addReport(
    reason: string,
    details: string,
    reportedBy: mongoose.Types.ObjectId,
    sellerId: mongoose.Types.ObjectId
  ): Promise<boolean> 
  subscribeToAuction(
    userId: string,
    auctionId: string,
    fcmToken?: string,
    email?: string,
    phoneNumber?: string,
    countryCode?: string
  ):Promise<void>
}

export default IAdminUseCase;
