import { Types } from 'mongoose';

export interface SalesMetrics {
  totalEarnings: number;
  monthlySpend: number;
  totalSales: number;
  salesGrowth: number;
}

export interface SalesDataPoint {
  label: string;
  sales: number;
}

export interface CategoryDistribution {
  name: string;
  value: number;
}

export interface DashboardData {
  metrics: SalesMetrics;
  salesData: {
    daily: SalesDataPoint[];
    weekly: SalesDataPoint[];
    monthly: SalesDataPoint[];
    yearly: SalesDataPoint[];
  };
  categoryDistribution: CategoryDistribution[];
}

export interface ISellerDashboardRepository {
  getSellerMetrics(sellerId: Types.ObjectId): Promise<SalesMetrics>;
  getSalesData(sellerId: Types.ObjectId, timeframe: string): Promise<SalesDataPoint[]>;
  getCategoryDistribution(sellerId: Types.ObjectId): Promise<CategoryDistribution[]>;
}
