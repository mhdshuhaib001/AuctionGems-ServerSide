import IAdminRepository from "../../interfaces/iRepositories/iAdminRepository";
import { User } from "../../interfaces/model/user";
import { Category, Pagination } from "../../interfaces/model/admin";
import { UserModel } from "../../entities_models/userModel";
import CategoryModel from "../../entities_models/categoryModel";
import { IReport } from "../../interfaces/model/IReport";
import ReportModel from "../../entities_models/reportModal";
import reportModal from "../../entities_models/reportModal";
import SellerModel from "../../entities_models/sellerModel";
import RevenueModel from "../../entities_models/adminRevenueModel";
import ProductModel from "../../entities_models/productModal";
import NotificationSubscriptionModel from "../../entities_models/Notification";
import Escrow, { EscrowFilters, IEscrow } from "../../entities_models/escrowModel";
import { 
  DashboardStats, 
  CategorySale, 
  RevenueData, 
  SellerReport, 
  RecentEscrow 
} from '../../interfaces/model/adminDashbord';
import escrowModel from "../../entities_models/escrowModel";
import { log } from "console";
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
      console.log(result,'this si the status result')

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
    await SellerModel.findByIdAndUpdate(sellerId, { 
      isBlocked: true 
    });
  }

  async getNotificationSubscription(
    auctionId: string,
    userId: string
  ): Promise<any> {
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
  ): Promise<void> {
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

  async findAllEscrow(filters?: EscrowFilters) {
    const query: any = {}
    
    if (filters?.status) {
      query.status = filters.status
    }
  
    if (filters?.startDate && filters?.endDate) {
      query.createdAt = {
        $gte: filters.startDate,
        $lte: filters.endDate
      }
    }
  
    // Enhanced search logic with searchType
    if (filters?.searchTerm) {
      if (filters.searchType === 'seller') {
        query['sellerId'] = { $regex: filters.searchTerm, $options: 'i' }
      } else if (filters.searchType === 'buyer') {
        query['buyerId'] = { $regex: filters.searchTerm, $options: 'i' }
      } else {
        // Default 'all' search across multiple fields
        query.$or = [
          { 'orderId._id': { $regex: filters.searchTerm, $options: 'i' } },
          { 'buyerId.name': { $regex: filters.searchTerm, $options: 'i' } },
          { 'sellerId.companyName': { $regex: filters.searchTerm, $options: 'i' } }
        ]
      }
    }
  
    const page = filters?.page || 1
    const limit = filters?.limit || 10
    const skip = (page - 1) * limit
  
    const [escrowPayments, totalCount] = await Promise.all([
      Escrow.find(query)
        .populate('buyerId')
        .populate('sellerId')
        .skip(skip)
        .limit(limit)
        .lean(),
      Escrow.countDocuments(query)
    ])
  
    return {
      data: escrowPayments,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page
    }
  }

  async getEscrowSummary(filters?: EscrowFilters) {
    const query: any = {}
    
    if (filters?.status) {
      query.status = filters.status
    }
  
    if (filters?.startDate && filters?.endDate) {
      query.createdAt = {
        $gte: filters.startDate,
        $lte: filters.endDate
      }
    }
  
    // Similar search logic as in findAllEscrow
    if (filters?.searchTerm) {
      if (filters.searchType === 'seller') {
        query['sellerId'] = { $regex: filters.searchTerm, $options: 'i' }
      } else if (filters.searchType === 'buyer') {
        query['buyerId'] = { $regex: filters.searchTerm, $options: 'i' }
      } else {
        query.$or = [
          { 'orderId._id': { $regex: filters.searchTerm, $options: 'i' } },
          { 'buyerId.name': { $regex: filters.searchTerm, $options: 'i' } },
          { 'sellerId.companyName': { $regex: filters.searchTerm, $options: 'i' } }
        ]
      }
    }
  
    const summary = await Escrow.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: "$totalAmount" },
          platformFee: { $sum: "$platformFee" },
          sellerEarnings: { $sum: "$sellerEarnings" },
          count: { $sum: 1 }
        }
      }
    ])
  
    return summary[0] || {
      totalAmount: 0,
      platformFee: 0,
      sellerEarnings: 0,
      count: 0
    }
  }

  async getDashboardStats(): Promise<DashboardStats> {
   try {
    const totalAuctions = await ProductModel.countDocuments();
    const liveAuctions = await ProductModel.countDocuments({ 
      auctionStatus: 'live' 
    });
    const totalSellers = await SellerModel.countDocuments();
    const totalRevenueResult = await RevenueModel.aggregate([

      { $group: { _id: null, total: { $sum: '$revenue' } } }
    ]);
    console.log("Total Revenue Result:", totalRevenueResult)

    return {
      totalAuctions,
      liveAuctions,
      totalSellers,
      totalRevenue: totalRevenueResult[0]?.total || 0
    };
   } catch (error) {
    console.error("Error in getDashboardStats:", error);
    throw new Error("Failed to getDashboardStats.");
   }
  }

  async getCategorySales(): Promise<CategorySale[]> {
    const categorySales = await ProductModel.aggregate([
      { $group: { 
          _id: '$categoryId', 
          value: { $sum: '$finalBidAmount' } 
        } 
      },
      { $lookup: {
          from: 'categories',
          localField: '_id',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: '$category' },
      { $project: {
          name: '$category.name',
          value: 1
        }
      }
    ]);
    
    return categorySales;
  }

  async getRevenueData(period: 'daily' | 'weekly' | 'monthly' | 'yearly'): Promise<RevenueData[]> {
    const groupStage = {
      daily: { $dateToString: { format: "%Y-%m-%d", date: { $convert: { input: "$date", to: "date" } } } },
      weekly: { $dateToString: { format: "%Y-W%V", date: { $convert: { input: "$date", to: "date" } } } },
      monthly: { $dateToString: { format: "%Y-%m", date: { $convert: { input: "$date", to: "date" } } } },
      yearly: { $dateToString: { format: "%Y", date: { $convert: { input: "$date", to: "date" } } } }
    };
  
    const revenueData = await RevenueModel.aggregate([
      {
        $addFields: {
          convertedDate: { $convert: { input: "$date", to: "date" } }
        }
      },
      {
        $group: {
          _id: groupStage[period],
          revenue: { $sum: '$revenue' }
        }
      },
      { $sort: { _id: 1 } }, 
      {
        $project: {
          date: '$_id',
          revenue: 1,
          _id: 0
        }
      }
    ]);
  
    return revenueData;
  }
  
  
  async getTopSellerReports(): Promise<SellerReport[]> {
    const sellerReports = await SellerModel.aggregate([
      { $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'sellerId',
          as: 'products'
        }
      },
      { $addFields: {
          totalSales: { $size: '$products' },
          revenue: { $sum: '$products.finalBidAmount' }
        }
      },
      { $project: {
          id: '$_id',
          name: '$companyName',
          totalSales: 1,
          revenue: 1,
          rating: { $ifNull: ['$rating', 4.5] }
        }
      },
      { $sort: { revenue: -1 } },
      { $limit: 5 }
    ]);
    
    return sellerReports;
  }

  async getRecentEscrows(): Promise<RecentEscrow[]> {
    const recentEscrows = await escrowModel.aggregate([
      { $lookup: {
          from: 'sellers',
          localField: 'sellerId',
          foreignField: '_id',
          as: 'seller'
        }
      },
      { $unwind: '$seller' },
      { $project: {
          id: '$_id',
          orderId: '$orderId',
          buyerId: '$buyerId',
          sellerId: '$sellerId',
          sellerName: '$seller.companyName',
          totalAmount: '$totalAmount',
          status: 1
        }
      },
      { $sort: { createdAt: -1 } },
      { $limit: 10 }
    ]);
    
    return recentEscrows;
  }
}

export default AdminRepository;
