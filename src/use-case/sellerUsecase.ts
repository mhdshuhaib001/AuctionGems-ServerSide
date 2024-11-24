import SellerRepository from "../infrastructure/repositories/SellerRepository";
import userRepository from "../infrastructure/repositories/UserRepositories";
import JWT from "../providers/jwt";
import { Seller, SellerResponse } from "../interfaces/model/seller";
import ProductRepository from "../infrastructure/repositories/ProductRepository";
import { Product } from "../interfaces/model/seller";
import AdminRepository from "../infrastructure/repositories/AdminRepository";
import CloudinaryHelper from "../providers/cloudinaryHelper";
import { IReview } from "../interfaces/model/IReview";
import mongoose, { Types } from "mongoose";
import { DashboardData } from "../interfaces/model/ISellerDashBord";
class SellerUseCase {
  constructor(
    private readonly _SellerRepository: SellerRepository,
    private readonly _UserRepository: userRepository,
    private readonly _jwt: JWT,
    private readonly _ProductRepository: ProductRepository,
    private readonly _AdminRepository: AdminRepository,
    private readonly _cloudinaryHelper: CloudinaryHelper
  ) {}

  async createSeller(sellerData: Seller) {
    try {
      const existingName = await this._SellerRepository.findByName(
        sellerData.companyName
      );
      if (existingName) {
        return {
          status: 400,
          message: "Seller name already taken"
        };
      }
      const result = await this._SellerRepository.insertOne(sellerData);
      await this._UserRepository.updateRole(
        sellerData.userId.toString(),
        "seller"
      );
      const sellerToken = this._jwt.createAccessToken(
        sellerData.userId.toString(),
        "seller"
      );

      return {
        status: 202,
        message: "Seller created successfully",
        sellerData: sellerData,
        sellerId: result._id,
        sellerToken
      };
    } catch (error) {
      console.error("Error creating seller:", error);
      throw new Error("Failed to create seller.");
    }
  }

  async updateSeller(sellerData: Seller, image: Express.Multer.File | null) {
    try {
      let imageUrl: string | null = null;

      // Check if the seller exists
      const sellerExists = await this._SellerRepository.existsBySellerId(
        sellerData._id
      );
      if (!sellerExists) {
        return {
          status: 404,
          message: "Seller not found"
        };
      }

      if (image) {
        console.log("Starting upload to Cloudinary...");
        try {
          imageUrl = await this._cloudinaryHelper.uploadBuffer(
            image.buffer,
            "seller_images"
          );
        } catch (uploadError) {
          console.error("Image upload failed:", uploadError);
          return {
            status: 500,
            message: "Failed to upload image"
          };
        }
      } else {
        console.log("No image provided, skipping upload.");
      }

      // Prepare the updated seller data
      const updatedSellerData = {
        ...sellerData,
        profile: imageUrl ? imageUrl : sellerData.profile
      };

      // Update seller information in the repository
      const updateResponse = await this._SellerRepository.updateSeller(
        sellerData._id,
        updatedSellerData
      );
      console.log("Update Response:", updateResponse);

      return {
        status: 200,
        message: "Seller updated successfully",
        data: updateResponse
      };
    } catch (error) {
      console.error("Error updating seller:", error);
      return {
        status: 500,
        message: "Failed to update seller"
      };
    }
  }

  async createProduct(
    productData: Product,
    images: Buffer[]
  ): Promise<{ status: number; message: string; productData?: Product }> {
    try {
      if (!Array.isArray(images) || images.length === 0) {
        throw new Error("No images provided");
      }

      const uploadPromise = images.map((imageBuffer) =>
        this._cloudinaryHelper.uploadBuffer(
          imageBuffer,
          "auction_gems/product_images"
        )
      );
      const imageUrl = await Promise.all(uploadPromise);
      const updatedProductData = { ...productData, images: imageUrl };

      const currentTime = new Date();
      if (productData.auctionFormat === "auction") {
        if (new Date(productData.auctionStartDateTime) > currentTime) {
          updatedProductData.auctionStatus = "upcoming";
        } else {
          updatedProductData.auctionStatus = "live";
        }
      } else {
        updatedProductData.auctionStatus = "live";
      }

      const product = await this._ProductRepository.insertOne(
        updatedProductData as any
      );

      return {
        status: 201,
        message: "Product created successfully",
        productData: product
      };
    } catch (error) {
      console.error("Error creating product:", error);
      throw new Error("Failed to create product.");
    }
  }

  async fetchSellerProducts(
    sellerId: string
  ): Promise<{ status: number; message: string; products?: Product[] }> {
    try {
      const products = await this._SellerRepository.getAllProducts(sellerId);
      if (products.length > 0) {
        const productsWithCategory = products.map((product) => {
          const plainProduct = product.toObject();
          plainProduct.category = plainProduct.categoryId || {
            id: null,
            name: "Unknown Category"
          };
          delete plainProduct.categoryId;
          return plainProduct;
        });

        return {
          status: 200,
          message: "Products fetched successfully",
          products: productsWithCategory
        };
      }

      return {
        status: 404,
        message: "No products found for this seller"
      };
    } catch (error) {
      console.error("Error fetching products:", error);
      return {
        status: 500,
        message: "Failed to fetch products"
      };
    }
  }

  async deleteProduct(productId: string): Promise<SellerResponse> {
    try {
      await this._SellerRepository.deleteProduct(productId);

      return {
        status: 200,
        message: "Product deleted successfully"
      };
    } catch (error) {
      console.error("Error deleting product:", error);
      return {
        status: 500,
        message: "Failed to delete product"
      };
    }
  }

  async getProduct(productId: string): Promise<SellerResponse> {
    try {
      const product = await this._SellerRepository.getProductById(productId);
      if (!product) {
        return {
          status: 404,
          message: "Product not found"
        };
      }

      return {
        status: 200,
        message: "Product fetched successfully",
        productData: product
      };
    } catch (error) {
      console.error("Error getting product:", error);
      throw new Error("Failed to get product.");
    }
  }

  async getAllProducts(
    page: number,
    limit: number
  ): Promise<{
    status: number;
    message: string;
    products?: Product[];
  }> {
    try {
      const products = await this._SellerRepository.getAll(page, limit);
      return {
        status: 200,
        message: "All products fetched successfully",
        products
      };
    } catch (error) {
      console.error("Error fetching all products:", error);
      return {
        status: 500,
        message: "Failed to fetch products"
      };
    }
  }

  async fetchSeller(
    sellerId: any
  ): Promise<{ status: number; message: string; seller?: Seller | null }> {
    try {
      console.log("suiiiii");

      const seller = await this._SellerRepository.findById(sellerId);
      if (!seller) {
        return {
          status: 404,
          message: "Seller not found"
        };
      }

      return {
        status: 200,
        message: "Seller fetched successfully",
        seller
      };
    } catch (error) {
      console.error("Error fetching seller:", error);
      return {
        status: 500,
        message: "Failed to fetch seller"
      };
    }
  }

  async getAllOrders(sellerId: string): Promise<any> {
    try {
      const orders = await this._SellerRepository.getAllOrders(sellerId);

      // const ordersWithDetails = await Promise.all(
      //   orders.map(async (order: { productId: string; buyerId: string }) => {
      //     const product = await this._ProductRepository.getProductById(
      //       order.productId
      //     );
      //     const buyer = await this._UserRepository.findById(order.buyerId);

      //     return {
      //       ...order,
      //       productName: product?.itemTitle,
      //       buyerName: buyer ? buyer.name : "Unknown"
      //     };
      //   })
      // );

      return {
        status: 200,
        message: "Orders fetched successfully",
        orders: orders
      };
    } catch (error) {
      console.error("Error fetching orders:", error);
      return {
        status: 500,
        message: "Failed to fetch orders"
      };
    }
  }

  async fetchAllSeller(): Promise<Seller[]> {
    console.log("fetch all seller ");
    const sellerDatas = await this._SellerRepository.getAllSeller();
    return sellerDatas;
  }

  async updateOrderStatus(orderId: string, newStatus: string): Promise<any> {
    try {
      const order = await this._SellerRepository.getOrderById(orderId);
      if (!order) throw new Error("Order not found");
  
      const escrow = await this._SellerRepository.getEscrowByOrderId(orderId);
      if (!escrow) throw new Error("Escrow not found");
  
      if (newStatus === 'delivered') {
        const platformFee = escrow.platformFee;
        const sellerEarnings = escrow.sellerEarnings;
        
        await this._SellerRepository.releaseEscrow(orderId);
  
        const sellerRevenueData = {
          orderId,
          productId: order.productId,
          sellerId: order.sellerId,
          sellerEarnings,
          platformFee,
        };
        await this._SellerRepository.saveSellerRevenue(sellerRevenueData);
  
        // Save Admin Revenue record
        const adminRevenueData = {
          date: new Date().toISOString(),
          revenue: platformFee, 
        };
        await this._SellerRepository.saveAdminRevenue(adminRevenueData);
  
        // Update order status to 'delivered'
        const updatedOrder = await this._SellerRepository.updateOrderStatus(orderId, newStatus);
        return {
          status: 200,
          message: "Order status updated successfully",
          order: updatedOrder
        };
      }
  
      // Default case for other statuses
      const updatedOrder = await this._SellerRepository.updateOrderStatus(orderId, newStatus);
      return {
        status: 200,
        message: "Order status updated successfully",
        order: updatedOrder
      };
    } catch (error) {
      console.error("Error updating order status:", error);
      return {
        status: 500,
        message: "Failed to update order status"
      };
    }
  }
  

  
  async createReview(
    sellerId: string,
    userId: string,
    rating: number,
    comment: string
  ): Promise<any> {
    const reviewData: Partial<IReview> = {
      sellerId: new mongoose.Types.ObjectId(sellerId),
      user: new mongoose.Types.ObjectId(userId),
      rating,
      comment
    };

    try {
      const newReview = await this._SellerRepository.addReview(
        reviewData as IReview
      );
      return {
        status: 201,
        message: "Review added successfully",
        review: newReview
      };
    } catch (error) {
      console.error("Failed to add review:", error);
      return {
        status: 500,
        message: "Failed to add review"
      };
    }
  }

  // async getReviews(sellerId: string): Promise<IReview[]> {
  //   try {
  //     console.log(sellerId, "sellerId in the review area");
  //     const response = await this._SellerRepository.getReview(sellerId);
  //     return response;
  //   } catch (error) {
  //     console.error("Error fetching review data:", error);
  //     throw new Error(`Failed to get review data: `);
  //   }
  // }

  async fetchFullSellerProfile(sellerId: string): Promise<{
    sellerProfile: Seller | null;
    sellerProducts: Product[];
    sellerReviews: IReview[];
  }> {
    try {
      const sellerProfile = await this._SellerRepository.findSeller(sellerId);
      if (!sellerProfile) {
        throw new Error("Seller not found");
      }

      const sellerProducts =
        await this._SellerRepository.getAllProducts(sellerId);

      const sellerReviews =
        await this._SellerRepository.findReviewsBySellerId(sellerId);

      return { sellerProfile, sellerProducts, sellerReviews };
    } catch (error) {
      console.error("Error fetching full seller profile:", error);

      throw new Error(`Failed to fetch seller profile: `);
    }
  }

  async execute(sellerId: string, timeframe: string): Promise<DashboardData> {
    const sellerObjectId = new Types.ObjectId(sellerId);

    const [metrics, salesData, categoryDistribution] = await Promise.all([
      this._SellerRepository.getSellerMetrics(sellerObjectId),
      this._SellerRepository.getSalesData(sellerObjectId, timeframe),
      this._SellerRepository.getCategoryDistribution(sellerObjectId)
    ]);

    return {
      metrics,
      salesData: {
        daily: timeframe === 'daily' ? salesData : [],
        weekly: timeframe === 'weekly' ? salesData : [],
        monthly: timeframe === 'monthly' ? salesData : [],
        yearly: timeframe === 'yearly' ? salesData : []
      },
      categoryDistribution
    };
  }
}

export default SellerUseCase;
