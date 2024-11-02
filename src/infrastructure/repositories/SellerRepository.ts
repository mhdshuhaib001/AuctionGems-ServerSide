import SellerModel from "../../entities_models/sellerModel";
import ProductModel from "../../entities_models/productModal";
import { ISellerRepository } from "../../interfaces/iRepositories/iSellerRepository";
import { Seller, Product } from "../../interfaces/model/seller";
import OrderModel from "../../entities_models/orderModel";
import IOrder from "../../interfaces/model/order";
import { console } from "inspector";

class SellerRepository implements ISellerRepository {
  existsByEmail(email: string) {
    throw new Error("Method not implemented.");
  }
  async insertOne(sellerData: Omit<Seller, "_id">): Promise<Seller> {
    try {
      console.log(sellerData, "suiiiiiiii");
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

  async getAllProducts(sellerId: string): Promise<Product[]> {
    try {
      const products = await ProductModel.find({ sellerId })
        .populate('categoryId', 'name') 
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
      const seller = await SellerModel.findById(id).populate('userId', 'email').exec();
      
      return seller;
    } catch (error) {
      console.error("Error finding seller by ID:", error);
      throw new Error("Failed to find seller.");
    }
  }


  async getProductById(productId: string): Promise<Product | null> {
    try {
      const result = await ProductModel.findById(productId)
      .populate({
          path: 'sellerId',
          select: 'companyName profile'
      })
      .exec();      if (!result) {
        throw new Error("Product not found");
      }
      console.log(result, "result");
      return result;
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw new Error("Failed to fetch product.");
    }
  }

  async getAll(page: number, limit: number): Promise<Product[]> {
    try {
      const total = await ProductModel.countDocuments();
      const products = await ProductModel.find()
        .populate('categoryId', 'name')
        .skip((page - 1) * limit)
        .limit(limit);
        return products;
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
      .populate('productId', 'itemTitle images') 
      .populate('buyerId', 'name') 
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

}

export default SellerRepository;
