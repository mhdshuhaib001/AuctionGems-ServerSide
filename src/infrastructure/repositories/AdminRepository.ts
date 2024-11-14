import IAdminRepository from "../../interfaces/iRepositories/iAdminRepository";
import { User } from "../../interfaces/model/user";
import { Category, Pagination } from "../../interfaces/model/admin";
import { UserModel } from "../../entities_models/userModel";
import CategoryModel from "../../entities_models/categoryModel";
import { IReport } from "../../interfaces/model/IReport";
import ReportModel from "../../entities_models/reportModal";
import mongoose, { Document } from "mongoose";
import reportModal from "../../entities_models/reportModal";
import SellerModel from "../../entities_models/sellerModel";
import NotificationSubscriptionModel from "../../entities_models/Notification";

class AdminRepository implements IAdminRepository {
  async getAllUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find().exec();
      return users;
    } catch (error) {
      throw new Error("Error fetching users");
    }
  }

  async updateUserStatus(userId: string): Promise<User | null> {
    try {
      const user = await UserModel.findById(userId).exec();

      if (!user) {
        throw new Error(`User with ID ${userId} not found`);
      }

      user.isActive = !user.isActive;

      const result = await user.save();

      return result;
    } catch (error) {
      throw new Error(`Error updating user status with ID ${userId}: ${error}`);
    }
  }

  async addCategory(categoryData: Category): Promise<boolean> {
    try {
      const Category = new CategoryModel(categoryData);
      await Category.save();
      return true;
    } catch (error) {
      throw new Error(`Error adding new category: ${error}`);
    }
  }
  async getAllCategory(
    pagination: Pagination
  ): Promise<{ categories: Category[]; totalCategories: number }> {
    try {
      const { page, limit } = pagination;
      const categories = await CategoryModel.find()
        .skip((page - 1) * limit)
        .limit(limit);
      const totalCategories = await CategoryModel.countDocuments();
      return {
        categories,
        totalCategories
      };
    } catch (error) {
      throw new Error("Error fetching categories");
    }
  }

  async updateCategory(_id: string, updatedData: any): Promise<boolean> {
    try {
      const updatedCategory = await CategoryModel.findByIdAndUpdate(
        _id,
        updatedData,
        {
          new: true
        }
      );
      return updatedCategory;
    } catch (error) {
      throw new Error("Error updateing categories");
    }
  }
  async getAllCategorys(): Promise<Category[]> {
    try {
      const categories = await CategoryModel.find();
      return categories;
    } catch (error) {
      throw new Error("Error fetching categories");
    }
  }

  async getCategoryByIds(categoryIds: string[]): Promise<Category[]> {
    try {
      const categories = await CategoryModel.find({
        _id: { $in: categoryIds }
      });
      return categories;
    } catch (error) {
      throw new Error("Error fetching categories");
    }
  }

  async getCategoryById(id: string): Promise<Category | null> {
    try {
      const category = await CategoryModel.findOne({ _id: id });
      return category || null;
    } catch (error) {
      console.error("Error fetching category by ID:", error);
      throw new Error("Error fetching category by ID");
    }
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const result = await CategoryModel.findByIdAndDelete(categoryId);
      return result;
    } catch (error) {
      throw new Error("Error deleting category");
    }
  }

  async addReport(reportData: Partial<IReport>): Promise<void> {
    try {
      const newReport = await new ReportModel(reportData);
      await newReport.save();
      console.log("Report added successfully to the database");
    } catch (error) {
      throw new Error(`Error adding report: ${error}`);
    }
  }
  async getReports(): Promise<IReport[] | null> {
    try {

      const reports = await reportModal
        .find()
        .populate("reportedBy", "name")
        .populate("sellerId", "companyName")
        .lean<IReport[]>();

      return reports;
    } catch (error) {
      throw new Error(`Error fetching reports: ${error}`);
    }
  }

  async updateReportStatus(
    reportId: string,
    status: string
  ): Promise<IReport | null> {
    try {
      const result = (await reportModal.findOneAndUpdate(
        { _id: reportId },
        { status, updatedAt: new Date() },
        { new: true }
      )) as IReport | null;

      return result;
    } catch (error) {
      console.error("Error updating report status in repository:", error);
      throw new Error("Could not update report status");
    }
  }

  async countConfirmedReports(sellerId: string): Promise<number> {
    return reportModal.countDocuments({
      sellerId,
      status: "confirmed",
      createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
  }

  async blockSeller(sellerId: string): Promise<void> {
    await SellerModel.findByIdAndUpdate(sellerId, { status: "blocked" });
  }

  async getNotificationSubscription(auctionId: string, userId: string): Promise<any> {
    try {
      return await NotificationSubscriptionModel.findOne({ auctionId, userId });
    } catch (error) {
      console.error("Error fetching notification subscription:", error);
      throw error;
    }
  }


  async upsertNotificationPreferences(
    userId: string,
    auctionId: string,
    fcmToken?: string,
    email?: string,
    whatsappNumber?: string,  
    auctionStartTime?: string
  ) :Promise<void>{
    try {
      await NotificationSubscriptionModel.findOneAndUpdate(
        { userId, auctionId },
        { 
          userId,
          auctionId,
          fcmToken,
          email,
          whatsappNumber,
          auctionStartTime
        },
        { upsert: true, new: true }
      );
    } catch (error) {
      console.error("Error in upsertNotificationPreferences:", error);
      throw new Error("Failed to upsert notification preferences.");
    }
  }
}
  


export default AdminRepository;
