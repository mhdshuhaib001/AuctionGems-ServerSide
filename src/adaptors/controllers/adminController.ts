import mongoose from "mongoose";
import AdminUseCase from "../../use-case/adminUseCase";
import UserUseCase from "../../use-case/userUseCase";
import { Request, Response } from "express";
import { IReport } from "../../interfaces/model/IReport";

class AdminController {
  constructor(private readonly _AdminUsecase: AdminUseCase) {}

  async adminLogin(req: Request, res: Response) {
    try {
      const AdminData = req.body;
      const result = await this._AdminUsecase.adminLogin(AdminData);
      res.status(result.status || 200).json(result);
    } catch (error) {
      console.error("Error during sign in:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
  async fetchUsers(req: Request, res: Response) {
    try {
      const users = await this._AdminUsecase.fetchAllUsers();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateUserActiveStatus(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const result = await this._AdminUsecase.updateUserActiveStatus(userId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error actionhandle admin:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addCategory(req: Request, res: Response) {
    try {
      const files = req.files as
        | { [fieldname: string]: Express.Multer.File[] }
        | undefined;

      if (!files) {
        return res.status(400).json({ error: "Files are required" });
      }

      const imageFile = files["image"] ? files["image"][0] : null;
      const iconFile = files["icon"] ? files["icon"][0] : null;

      let imageUrl: string | null = null;
      let iconUrl: string | null = null;

      const categoryData = {
        name: req.body.name,
        imageUrl: imageUrl || "",
        iconUrl: iconUrl || ""
      };

      const response = await this._AdminUsecase.addCategory(
        categoryData,
        imageFile,
        iconFile
      );

      res
        .status(201)
        .json({ message: "Category added successfully", data: response });
    } catch (error) {
      console.error("Error in addCategory controller:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async getAllCategory(req: Request, res: Response) {
    try {
      const pageQuery = req.body.page;
      const limitQuery = req.body.limit;
      const page = typeof pageQuery === "string" ? parseInt(pageQuery) : 1;
      const limit = typeof limitQuery === "string" ? parseInt(limitQuery) : 5;

      const categories = await this._AdminUsecase.getAllCategory({
        page,
        limit
      });
      res.status(200).json(categories);
    } catch (error) {
      console.error("Error in getAllCategory controller:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateCategory(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      const updateData = { ...req.body };
      const files = req.files;

      const updatedCategory = await this._AdminUsecase.updateCategory(
        categoryId,
        updateData,
        files
      );
    } catch (error) {
      console.error("Error in controller:", error);
      res.status(500).json({ message: "Failed to update category", error });
    }
  }

  async deleteCategory(req: Request, res: Response) {
    try {
      const categoryId = req.params.id;
      const result = await this._AdminUsecase.deleteCategory(categoryId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in deleteCategory controller:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async sendWatsappNotification(req: Request, res: Response) {
    try {
      res.status(200);
      const { to, message } = req.body;
      console.log(req.body, "fffffffffffffffffffffffffffffffffffffffffff");
      if (!to || !message) {
        return res
          .status(400)
          .json({ success: false, message: "To and message are required." });
      }

      const response = this._AdminUsecase.sendWhatsAppNotificationUseCase(
        to,
        message
      );

      res.status(200).json({ success: true, message: "Notification sent!" });
    } catch (error) {
      console.error("Error in sendMessage controller:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  async addReport(req: Request, res: Response) {
    try {
      const { reason, details, sellerId, reportedBy } = req.body;
      const response = await this._AdminUsecase.addReport(
        reason,
        details,
        reportedBy,
        sellerId
      );
      console.log("Report added successfully");
      res.status(201).json(response);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to add report" });
    }
  }

  async auctionNotification(req: Request, res: Response) {
    try {
      console.log(req.body,'===================================================================================')
      const { auctionId, userId, fcmToken, email, phoneNumber, countryCode } =
        req.body;

      await this._AdminUsecase.subscribeToAuction(
        userId,
        auctionId,
        fcmToken,
        email,
        phoneNumber,
        countryCode
      );

      res.status(200).json({ message: "Notification sent" });
    } catch (error) {
      console.error("Error sending auction notification:", error);
      res.status(500).json({
        message: "An error occurred while sending the auction notification"
      });
    }
  }

  async getReports(req: Request, res: Response) {
    try {
      const reports = await this._AdminUsecase.getReports();
      res.status(201).json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to get reports" });
    }
  }

  async updateReportStatus(req: Request, res: Response): Promise<Response> {
    try {
      console.log(req.body, req.params);
      const status = req.body.status;
      const reportId = req.params.id;

      const { updatedReport, sellerBlocked } =
        await this._AdminUsecase.updateReportStatus(reportId, status);

      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }

      const message = sellerBlocked
        ? "Report status updated, seller has been blocked due to repeated reports."
        : "Report status updated successfully.";

      return res.status(200).json({ message });
    } catch (error) {
      console.error("Error updating report status in controller:", error);
      return res.status(500).json({
        message: "An error occurred while updating the report status."
      });
    }
  }
}

export default AdminController;
