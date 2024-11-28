import SellerModel from "../../entities_models/sellerModel";
import ProductModel from "../../entities_models/productModal";
import { ISellerRepository } from "../../interfaces/iRepositories/iSellerRepository";
import { Seller, Product } from "../../interfaces/model/seller";
import OrderModel from "../../entities_models/orderModel";
import IOrder from "../../interfaces/model/order";
import { console } from "inspector";
import { IReview } from "../../interfaces/model/IReview";
import ReviewModel from "../../entities_models/reviewModel";
import SellerRevenue from '../../entities_models/sellerRevanue';
import AdminRevanue from '../../entities_models/adminRevenueModel'
import { 
  ISellerDashboardRepository, 
  SalesMetrics, 
  SalesDataPoint,
  CategoryDistribution 
} from '../../interfaces/model/ISellerDashBord';
import mongoose, { ObjectId, Types } from "mongoose";
import { IEscrow } from "../../entities_models/escrowModel";
import Escrow from "../../entities_models/escrowModel";

class SellerRepository implements ISellerRepository {
  existsByEmail(email: string) {
    throw new Error("Method not implemented.");
  }
  async insertOne(sellerData: Omit<Seller, "_id">): Promise<Seller> {
    try {
      const newSeller = new SellerModel(sellerData);

      await newSeller.save();
      return newSeller;
    } catch (error) {
      console.error("Error inserting seller:", error);
      throw new Error("Failed to insert seller.");
    }
  }

  async findById(id: string): Promise<Seller | null> {
    try {
      const seller = await SellerModel.findById(id).exec();
      return seller;
    } catch (error) {
      console.error("Error finding seller by ID:", error);
      throw new Error("Failed to find seller.");
    }
  }

  async existsByUserId(userId: string): Promise<Seller | null> {
    try {
      const seller = await SellerModel.findOne({ userId: userId }).exec();
      return seller;
    } catch (error) {
      console.error("Error checking if seller exists by UserID:", error);
      throw new Error("Failed to check seller existence.");
    }
  }

  async existsBySellerId(_id: string): Promise<Seller | null> {
    try {
      const seller = await SellerModel.findOne({ _id }).exec();
      console.log(seller);
      return seller;
    } catch (error) {
      console.error("Error checking if seller exists by email or ID:", error);
      throw new Error("Failed to check seller existence.");
    }
  }

  async findByName(CompanyName: string): Promise<Seller | null> {
    try {
      const seller = await SellerModel.findOne({ CompanyName });
      return seller;
    } catch (error) {
      console.error("Error finding seller by name", error);
      throw new Error("Failed to find seller");
    }
  }

  async getAllProducts(
    sellerId: string,
    page: number = 1,
    limit: number = 4  
  ): Promise<{
    products: Product[];
  }> {
    try {
      const skip = (page - 1) * limit;
      
      const products = await ProductModel.find({ sellerId })
        .populate("categoryId", "name")
        .skip(skip)
        .limit(limit)
        .exec();
      
      return { products };
    } catch (error) {
      console.error("Error getting products:", error);
      throw new Error("Failed to retrieve products");
    }
  }


  async getAllSellerProducts(sellerId: string): Promise<Product[]> {
    try {
      const products = await ProductModel.find({ sellerId })
        .populate("categoryId", "name")
        .exec();

      if (!products || products.length === 0) {
        throw new Error("No products found for this seller.");
      }

      return products;
    } catch (error) {
      console.error("Error getting all products for seller:", error);
      throw new Error("Failed to get products.");
    }
  }


  async deleteProduct(productId: string): Promise<void> {
    try {
      const result = await ProductModel.findByIdAndDelete(productId);
      if (!result) {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      throw new Error("Failed to delete product.");
    }
  }

  async findSeller(id: string): Promise<Seller | null> {
    try {
      console.log(id,'sellerId')
      const seller = await SellerModel.findById(id)
        .populate("userId", "email")
        .exec();

      return seller;
    } catch (error) {
      console.error("Error finding seller by ID:", error);
      throw new Error("Failed to find seller.");
    }
  }

  async getProductById(productId: string): Promise<Product | null> {
    try {
      console.log("Fetching product with ID:", productId);
      const result = await ProductModel.findById(productId)
        .populate({
          path: "sellerId",
          select: "companyName profile"
        })
        .exec();
  
      if (!result) {
        console.error("Product not found for ID:", productId);
        throw new Error("Product not found");
      }
      console.log(result, "result");
      return result;
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw new Error("Failed to fetch product.");
    }
  }
  

  async getAll(page: number, limit: number): Promise<{ products: Product[]; totalPages: number; currentPage: number; totalItems: number }> {
    try {
      const totalItems = await ProductModel.countDocuments();
      const products = await ProductModel.find()
        .populate("categoryId", "name")
        .skip((page - 1) * limit)
        .limit(limit);
  
      const totalPages = Math.ceil(totalItems / limit);
      return {
        products,
        totalPages,
        currentPage: page,
        totalItems,
      };
    } catch (error) {
      console.error("Error getting all products:", error);
      throw new Error("Failed to get products.");
    }
  }
  

  async updateSeller(
    sellerId: string,
    sellerData: Partial<Omit<Seller, "_id">>
  ): Promise<Seller | null> {
    try {
      const updatedSeller = await SellerModel.findByIdAndUpdate(
        sellerId,
        sellerData,
        { new: true, runValidators: true }
      ).exec();
      if (!updatedSeller) {
        throw new Error("Seller not found");
      }
      return updatedSeller;
    } catch (error) {
      console.error("Error updating seller:", error);
      throw new Error("Failed to update seller.");
    }
  }

  async getAllOrders(sellerId: string): Promise<any> {
    try {
      const orders = await OrderModel.find({ sellerId })
        .populate("productId", "itemTitle images")
        .populate("buyerId", "name")
        .exec();
      return orders;
    } catch (error) {
      console.error("Error getting all orders for seller:", error);
      throw new Error("Failed to get orders.");
    }
  }

  async updateOrderStatus(
    orderId: string,
    newStatus: string
  ): Promise<IOrder | null> {
    try {
      const updatedOrder = await OrderModel.findByIdAndUpdate(
        orderId,
        { orderStatus: newStatus },
        { new: true }
      ).exec();
      if (!updatedOrder) {
        throw new Error("Order not found");
      }
      return updatedOrder;
    } catch (error) {
      console.error("Error updating order status:", error);
      throw new Error("Failed to update order status.");
    }
  }


  
 
  


  async releaseEscrow(orderId: string): Promise<void> {
    try {
      const escrow = await Escrow.findOne({ orderId });
      if (!escrow) throw new Error("Escrow not found");
  
      escrow.status = 'released';
      await escrow.save();
    } catch (error) {
      throw new Error(`Error releasing escrow:${error} `);
    }
  }
  async getOrderById(orderId: string): Promise<IOrder | null> {
    try {
      const order = await OrderModel.findById(orderId)
        .populate('productId')
        .populate('sellerId')
        .exec();
      
      if (!order) {
        throw new Error("Order not found");
      }
      
      return order;
    } catch (error) {
      console.error("Error getting order by ID:", error);
      throw new Error("Failed to retrieve order.");
    }
  }

  async getEscrowByOrderId(orderId: string): Promise<IEscrow | null> {
    try {
      const escrow = await Escrow.findOne({ orderId })
        .populate('buyerId')
        .populate('sellerId')
        .exec();
      
      if (!escrow) {
        throw new Error("Escrow not found");
      }
      
      return escrow;
    } catch (error) {
      console.error("Error getting escrow by order ID:", error);
      throw new Error("Failed to retrieve escrow.");
    }
  }

  async saveSellerRevenue(revenueData: {
    orderId: string;
    productId: Types.ObjectId; 
    sellerId: Types.ObjectId;  
    sellerEarnings: number;
    platformFee: number;
  }): Promise<void> {
    try {
      const newRevenue = new SellerRevenue({
        orderId: new mongoose.Types.ObjectId(revenueData.orderId),
        productId: revenueData.productId, 
        sellerId: revenueData.sellerId,   
        sellerEarnings: revenueData.sellerEarnings,
        platformFee: revenueData.platformFee
      });
  
      await newRevenue.save();
      console.log("Seller revenue saved successfully.");
    } catch (error) {
      console.error("Error saving seller revenue:", error);
      throw new Error("Failed to save seller revenue.");
    }
  }
  

  async saveAdminRevenue(revenueData: {
    date: Date;
    revenue: number;
    sellerId?: string;
    productId?: string;
  }): Promise<void> {
    try {
      const newRevenue = new AdminRevanue({
        date: revenueData.date,
        revenue: revenueData.revenue,
        sellerId: revenueData.sellerId 
          ? new mongoose.Types.ObjectId(revenueData.sellerId) 
          : undefined,
        productId: revenueData.productId 
          ? new mongoose.Types.ObjectId(revenueData.productId) 
          : undefined
      });
  
      await newRevenue.save();
      console.log("Admin revenue saved successfully.");
    } catch (error) {
      console.error("Error saving admin revenue:", error);
      throw new Error("Failed to save admin revenue.");
    }
  }
  
  async getAllSeller(): Promise<Seller[]> {
    try {
      const sellerDatas = await SellerModel.find();
      console.log(sellerDatas);
      return sellerDatas;
    } catch (error) {
      console.log("Error finding All sellerDatas");
      throw new Error("Find all SellerData.");
    }
  }

  async getSellerByUserId(userId: string): Promise<Seller | null> {
    try {
      const seller = await SellerModel.findOne({ userId }).exec();
      return seller;
    } catch (error) {
      console.error("Error getting seller by userId:", error);
      throw new Error("Failed to get seller.");
    }
  }

  async addReview(reviewData: IReview): Promise<IReview> {
    try {
      const response = await ReviewModel.create(reviewData);
      return response;
    } catch (error) {
      console.error("Error adding review:", error);
      throw new Error("Could not add review");
    }
  }
  async findReviewsBySellerId(sellerId: string): Promise<IReview[]> {
    try {
      const Id = new mongoose.Types.ObjectId(sellerId);
      const response = ReviewModel.find({ sellerId: Id }).populate('user','name profileImage' );
      console.log(response,'this is the review response')
      return response;
    } catch (error) {
      throw new Error("Could not find review");
    }
  }


  async getSellerMetrics(sellerId: Types.ObjectId): Promise<SalesMetrics> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const firstDayOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [totalEarnings, monthlySpend, currentMonthSales, lastMonthSales] = await Promise.all([
      SellerRevenue.aggregate([
        { $match: { sellerId } },
        { $group: { _id: null, total: { $sum: "$sellerEarnings" } } }
      ]),
      
      SellerRevenue.aggregate([
        {
          $match: {
            sellerId,
            createdAt: { $gte: firstDayOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: "$platformFee" } } }
      ]),

      SellerRevenue.aggregate([
        {
          $match: {
            sellerId,
            createdAt: { $gte: firstDayOfMonth }
          }
        },
        { $group: { _id: null, total: { $sum: "$sellerEarnings" } } }
      ]),

      SellerRevenue.aggregate([
        {
          $match: {
            sellerId,
            createdAt: { 
              $gte: firstDayOfLastMonth,
              $lt: firstDayOfMonth
            }
          }
        },
        { $group: { _id: null, total: { $sum: "$sellerEarnings" } } }
      ])
    ]);

    const currentSales = currentMonthSales[0]?.total || 0;
    const previousSales = lastMonthSales[0]?.total || 0;
    const salesGrowth = previousSales === 0 ? 100 : 
      ((currentSales - previousSales) / previousSales) * 100;

    return {
      totalEarnings: totalEarnings[0]?.total || 0,
      monthlySpend: monthlySpend[0]?.total || 0,
      totalSales: currentSales,
      salesGrowth
    };
  }

  async getSalesData(sellerId: Types.ObjectId, timeframe: string): Promise<SalesDataPoint[]> {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

    const aggregation = await SellerRevenue.aggregate([
      {
        $match: {
          sellerId,
          createdAt: { $gte: oneYearAgo }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            week: { $week: "$createdAt" },
            day: { $dayOfWeek: "$createdAt" }
          },
          sales: { $sum: "$sellerEarnings" }
        }
      }
    ]);

    return this.formatSalesData(aggregation, timeframe);
  }

  async getCategoryDistribution(sellerId: Types.ObjectId): Promise<CategoryDistribution[]> {
    const distribution = await ProductModel.aggregate([
      {
        $match: { sellerId, sold: true }
      },
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryId',
          foreignField: '_id',
          as: 'category'
        }
      },
      {
        $group: {
          _id: "$categoryId",
          name: { $first: "$category.name" },
          value: { $sum: 1 }
        }
      }
    ]);

    return distribution.map(item => ({
      name: item.name[0] || 'Uncategorized',
      value: item.value
    }));
  }

  private formatSalesData(aggregation: any[], timeframe: string): SalesDataPoint[] {
    const timeFrameFormats: Record<string, { labels: string[], length: number }> = {
      daily: { 
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        length: 7
      },
      weekly: {
        labels: Array.from({ length: 4 }, (_, i) => `Week ${i + 1}`),
        length: 4
      },
      monthly: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        length: 12
      },
      yearly: {
        labels: Array.from({ length: 4 }, (_, i) => `${new Date().getFullYear() - 3 + i}`),
        length: 4
      }
    };

    const format = timeFrameFormats[timeframe];
    const formatted = Array.from({ length: format.length }, (_, i) => ({
      label: format.labels[i],
      sales: 0
    }));

    // Populate with actual data
    aggregation.forEach(item => {
      const { year, month, week, day } = item._id;
      let index = 0;

      switch (timeframe) {
        case 'daily':
          index = day - 1;
          break;
        case 'weekly':
          index = week % 4;
          break;
        case 'monthly':
          index = month - 1;
          break;
        case 'yearly':
          index = year - (new Date().getFullYear() - 3);
          break;
      }

      if (index >= 0 && index < format.length) {
        formatted[index].sales = item.sales;
      }
    });

    return formatted;
  }
}

export default SellerRepository;
