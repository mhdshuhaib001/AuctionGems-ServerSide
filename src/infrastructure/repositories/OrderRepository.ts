import Escrow from "../../entities_models/escrowModel";
import { IEscrow } from "../../entities_models/escrowModel";
import OrderModel from "../../entities_models/orderModel";
import Revenue from "../../entities_models/adminRevenueModel";
import SellerRevenue from "../../entities_models/sellerRevanue";
import { ISellerRevenue } from "../../interfaces/model/ISellerRevenue";
// import { IOrder } from "../../interfaces/model/order";

class OrderRepository {
  async findOrderId(orderId: string): Promise<any | null> {
    try {
      const order = await OrderModel.findOne({ _id: orderId });
      return order;
    } catch (error) {
      console.error("Error finding order by payment ID:", error);
      throw new Error("Failed to find order by order ID");
    }
  }
  async saveOrder(orderData: any): Promise<any> {
    try {
      const order = await OrderModel.create(orderData);
      return order;
    } catch (error) {
      // Handle errors
      console.error("Error saving order:", error);
      throw new Error("Failed to save order");
    }
  }

  async createEscrow(escrowData: Omit<IEscrow, '_id'>): Promise<IEscrow> {
    try {
      const escrow = new Escrow(escrowData);
      return await escrow.save();
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw new Error('Failed to create escrow');
    }
  }
  

  async updateOrder(order: any): Promise<boolean> {
    try {
      await OrderModel.findByIdAndUpdate(order.id, order);
      return true;
    } catch (error) {
      console.error("Error updating order:", error);
      throw new Error("Failed to update order");
    }
  }

  async fetchOrderByUserId(userId: string): Promise<any | null> {
    try {
      const order = await OrderModel.findOne({ buyerId: userId });
      return order;
    } catch (error) {
      console.error("Error finding order by user ID:", error);
      throw new Error("Failed to find order by user ID");
    }
  }
  async fetchOrderById(orderId: string): Promise<any | null> {
    try {
      const order = await OrderModel.findOne({ _id: orderId });
      return order;
    } catch (error) {
      console.error("Error finding order by order ID:", error);
      throw new Error("Failed to find order by order ID");
    }
  }

  async addRevenue(revenueData: {
    orderId: string;
    productId: string;
    sellerId: string;
    platformFee: number;
    sellerEarnings: number;
  }) {
    try {
      await new Revenue({
        date: new Date().toISOString(),
        revenue: revenueData.platformFee + revenueData.sellerEarnings,
        orderId: revenueData.orderId,
        productId: revenueData.productId,
        sellerId: revenueData.sellerId
      }).save();
    } catch (error) {
      console.error("Error saving revenue data:", error);
      throw new Error("Failed to save revenue data");
    }
  }
  async sellerRevenue(revenueData: ISellerRevenue): Promise<ISellerRevenue> {
    try {
      console.log(revenueData);
      const revenue = await SellerRevenue.create(revenueData);
      return revenue;
    } catch (error) {
      console.error("Error adding seller revenue:", error);
      throw new Error("Failed to add seller revenue");
    }
  }
 

}

export { OrderRepository };
