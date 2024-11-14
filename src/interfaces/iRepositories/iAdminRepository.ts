import { User } from "../model/user";
import { Category, Pagination } from "../model/admin";
import { IReport } from "../model/IReport";
interface IAdminRepository {
  getAllUsers(): Promise<any>;
  addCategory(categoryData: Category): Promise<boolean>;
  deleteCategory(categoryId: string): Promise<boolean>;
  updateCategory(categoryId: string, updateData: Category): Promise<boolean>;
  getAllCategory(
    pagination: Pagination
  ): Promise<{ categories: Category[]; totalCategories: number }>;
  updateUserStatus(userId: string): Promise<User | null>;
  getAllCategorys(): Promise<Category[]>;
  getCategoryByIds(categoryIds: string[]): Promise<Category[]>
  addReport(reportData: Partial<IReport>): Promise<void>    
  getReports(): Promise<IReport[] | null>
  updateReportStatus(
    reportId: string,
    status: string
  ): Promise<IReport | null>
  countConfirmedReports(sellerId: string): Promise<number> 
  blockSeller(sellerId: string): Promise<void>
  getNotificationSubscription(auctionId: string, userId: string): Promise<any>
  upsertNotificationPreferences(
    userId: string,
    auctionId: string,
    fcmToken?: string,
    email?: string,
    whatsappNumber?: string,
    auctionStartTime?: string
  ) :Promise<void>
}

export default IAdminRepository;
