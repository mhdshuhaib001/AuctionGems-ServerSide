
import { Types } from 'mongoose';

export interface DashboardStats {
  totalAuctions: number;
  liveAuctions: number;
  totalSellers: number;
  totalRevenue: number;
}

export interface CategorySale {
  name: string;
  value: number;
}

export interface RevenueData {
  date: string;
  revenue: number;
}

export interface SellerReport {
  id: Types.ObjectId;
  name: string;
  totalSales: number;
  revenue: number;
  rating: number;
}

export interface RecentEscrow {
  id: string;
  orderId: string;
  buyerId: string;
  sellerId: string;
  sellerName: string;
  totalAmount: number;
  status: 'held' | 'released' | 'disputed';
}