import { Types } from "mongoose";
import { IReview } from "../model/IReview";
import { SalesDataPoint, SalesMetrics } from "../model/ISellerDashBord";
import IOrder from "../model/order";
import { Product, Seller } from "../model/seller";

export interface ISellerRepository {
  insertOne(seller: Seller): Promise<Seller>;
  findById(email: string): Promise<Seller | null>;
  existsByUserId(userId: string): Promise<Seller | null>;
  existsBySellerId(_id: string): Promise<Seller | null>;
  findByName(CompanyName: string): Promise<Seller | null>;
  getAllProducts(sellerId: string): Promise<Product[]>;
  deleteProduct(productId: string): Promise<void>;
  findSeller(id: string): Promise<Seller | null>;
  getProductById(productId: string): Promise<Product | null>;
  getAll(page: number, limit: number): Promise<Product[]>;
  updateSeller(
    sellerId: string,
    sellerData: Partial<Omit<Seller, "_id">>
  ): Promise<Seller | null>;
  getAllOrders(sellerId: string): Promise<any>
  updateOrderStatus(
    orderId: string,
    newStatus: string
  ): Promise<IOrder | null>
  getAllSeller(): Promise<Seller[]> 
  getSellerByUserId(userId: string): Promise<Seller | null>
  addReview(reviewData: IReview): Promise<IReview>
  findReviewsBySellerId(sellerId: string): Promise<IReview[]>
  getSellerMetrics(sellerId: Types.ObjectId): Promise<SalesMetrics>
  getSalesData(sellerId: Types.ObjectId, timeframe: string): Promise<SalesDataPoint[]>
}
