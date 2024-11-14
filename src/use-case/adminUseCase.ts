import IAdminUseCase from "../interfaces/iUseCases/iAdminUseCase";
import {
  Login as AdminLogin,
  Category,
  Pagination
} from "../interfaces/model/admin";
import AdminOutPut from "../interfaces/model/adminOutput";
import JWT from "../providers/jwt";
import AdminRepository from "../infrastructure/repositories/AdminRepository";
import CloudinaryHelper from "../providers/cloudinaryHelper";
import { IReport } from "../interfaces/model/IReport";
import mongoose from "mongoose";
import SellerRepository from "../infrastructure/repositories/SellerRepository";
import { messaging } from "../infrastructure/config/services/fireBaseConfig";
import NodeMailer from "../providers/nodeMailer";

class AdminUseCase implements IAdminUseCase {
  private readonly adminEmail: string = process.env.ADMIN_EMAIL!;
  private readonly adminPassword: string = process.env.ADMIN_PASSWORD!;

  constructor(
    private readonly _jwt: JWT,
    private readonly _adminRepository: AdminRepository,
    private readonly _cloudinaryHelper: CloudinaryHelper,
    private readonly _sellerRepository: SellerRepository
  ) {}

  async adminLogin(loginData: AdminLogin): Promise<AdminOutPut> {
    const { email, password } = loginData;
    if (email === this.adminEmail && password === this.adminPassword) {
      const token = this._jwt.createAccessToken("adminId", "admin");
      return {
        status: 200,
        message: "Login successful",
        adminToken: token,
        _id: "adminId"
      };
    } else {
      return {
        status: 401,
        message: "Invalid email or password"
      };
    }
  }
  async fetchAllUsers(): Promise<any> {
    try {
      const userDatas = await this._adminRepository.getAllUsers();
      return userDatas;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw new Error("Error fetching users");
    }
  }
  async updateUserActiveStatus(userId: string): Promise<any> {
    try {
      const result = await this._adminRepository.updateUserStatus(userId);
      console.log(result, "updated");
      return result;
    } catch (error) {
      console.error(`Error updating user status to ${status}:`, error);
      throw new Error(`Error updating user status to ${status}`);
    }
  }

  async addCategory(
    categoryData: Category,
    imageFile: Express.Multer.File | null,
    iconFile: Express.Multer.File | null
  ): Promise<boolean> {
    try {
      const categoryFolder = `category/${categoryData.name}`;

      const imageUrl = imageFile?.buffer
        ? await this._cloudinaryHelper.uploadBuffer(
            imageFile.buffer,
            categoryFolder
          )
        : "";
      const iconUrl = iconFile?.buffer
        ? await this._cloudinaryHelper.uploadBuffer(
            iconFile.buffer,
            categoryFolder
          )
        : "";
      categoryData.imageUrl = imageUrl;
      categoryData.iconUrl = iconUrl || "";

      const category = await this._adminRepository.addCategory(categoryData);

      return true;
    } catch (error) {
      console.error(
        `Error adding category Usecase: ${error instanceof Error ? error.message : error}`
      );
      return false;
    }
  }

  async getAllCategory(pagination: Pagination): Promise<any> {
    try {
      const { page, limit } = pagination;
      const { categories, totalCategories } =
        await this._adminRepository.getAllCategory({ page, limit });
      const totalPages = Math.ceil(totalCategories / limit);
      return {
        categories,
        totalPages,
        currentPage: page
      };
    } catch (error) {
      console.error(
        `Error fetching allcategory Usecase: ${error instanceof Error ? error.message : error}`
      );
    }
  }

  async updateCategory(
    categoryId: string,
    bodyData: any,
    files: any
  ): Promise<boolean> {
    try {
      const updateData = { ...bodyData };
      if (files) {
        if (files.image) {
          const imageFile = files.image[0];
          const imageUrl = await this._cloudinaryHelper.uploadBuffer(
            imageFile.buffer,
            "category"
          );

          updateData.imageUrl = imageUrl || "";
        }

        if (files.icon) {
          const iconFile = files.icon;

          const iconUrl = await this._cloudinaryHelper.uploadSingleFile(
            iconFile,
            "category"
          );

          updateData.iconUrl = iconUrl || "";
        }
      }

      const result = await this._adminRepository.updateCategory(
        categoryId,
        updateData
      );
      return result;
    } catch (error) {
      console.error(`Error update category Usecase: ${error instanceof Error}`);
      return false;
    }
  }

  async deleteCategory(categoryId: string): Promise<boolean> {
    try {
      const result = await this._adminRepository.deleteCategory(categoryId);
      return result;
    } catch (error) {
      console.error(
        `Error deleting category Usecase: ${error instanceof Error}`
      );
      return false;
    }
  }

  async addReport(
    reason: string,
    details: string,
    reportedBy: mongoose.Types.ObjectId,
    sellerId: mongoose.Types.ObjectId
  ): Promise<boolean> {
    try {
      const reportData = {
        reason,
        details,
        createdAt: new Date(),
        updatedAt: new Date(),
        reportedBy,
        sellerId
      };
      console.log(reportData, "this is fro the rersponse data");
      const result = await this._adminRepository.addReport(reportData);
      console.log("Report added successfully");
      return true;
    } catch (error) {
      console.error(
        `Error adding report: ${error instanceof Error ? error.message : error}`
      );
      return false;
    }
  }



  async subscribeToAuction(
    userId: string,
    auctionId: string,
    fcmToken?: string,
    email?: string,
    phoneNumber?: string,
    countryCode?: string
  ):Promise<void>{
    try {
      
      await this._adminRepository.upsertNotificationPreferences(
        userId,
        auctionId,
        fcmToken,
        email,
        phoneNumber ? countryCode + phoneNumber : undefined
      );
    } catch (error) {
      console.error("Error in subscribeToAuction:", error);
      throw new Error("Failed to subscribe to auction notifications.");
    }
  }

  async sendPushNotification(fcmToken: string, message: string) {
    const notificationMessage = {
      notification: {
        title: "Auction Notification",
        body: message
      },
      token: fcmToken
    };
    try {
      const response = await messaging.send(notificationMessage);
      console.log("Notification sent:", response);
    } catch (error) {
      console.error("Error sending notification:", error);
    }
  }

  async getReports(): Promise<IReport[]> {
    const reports = await this._adminRepository.getReports();
    return reports as IReport[];
  }

  async updateReportStatus(
    reportId: string,
    status: string
  ): Promise<{ updatedReport: IReport | null; sellerBlocked: boolean }> {
    try {
      const updatedReport = await this._adminRepository.updateReportStatus(
        reportId,
        status
      );

      if (!updatedReport) {
        console.error(`Report with ID ${reportId} not found`);
        return { updatedReport: null, sellerBlocked: false };
      }

      let sellerBlocked = false;

      // Get seller email using the sellerId
      if (status === "warning") {
        const seller = await this._sellerRepository.findSeller(
          updatedReport.sellerId.toString()
        );

        if (seller) {
          const sellerEmail = seller.userId.email;
          const warningMessage =
            "Please review your actions on the platform to avoid potential penalties.";
          const mailer = new NodeMailer();
          const emailSent = await mailer.sendWarningEmail(
            sellerEmail,
            warningMessage
          );

          if (!emailSent) {
            console.error("Failed to send warning email to the seller");
          }

          const reportDetails = `A warning has been issued regarding your recent activities. Please be cautious.`;
          const sellerName = seller.userId.name || "Seller";
          await mailer.sendReportManagementEmail(
            sellerEmail,
            status,
            reportDetails,
            sellerName
          );
        } else {
          console.error(`Seller with ID ${updatedReport.sellerId} not found`);
        }
      }

      if (status === "confirmed") {
        const reportCount = await this._adminRepository.countConfirmedReports(
          updatedReport.sellerId.toString()
        );

        if (reportCount >= 3) {
          await this._adminRepository.blockSeller(
            updatedReport.sellerId.toString()
          );
          sellerBlocked = true;
        }
      }

      return { updatedReport, sellerBlocked };
    } catch (error) {
      console.error("Error updating report status in use case:", error);
      throw new Error("Could not update report status");
    }
  }
}

export default AdminUseCase;
