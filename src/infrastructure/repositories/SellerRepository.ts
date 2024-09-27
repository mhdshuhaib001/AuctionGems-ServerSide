import SellerModel, { ProductModel } from "../../entities_models/sellerModel";
import { ISellerRepository } from "../../interfaces/iRepositories/iSellerRepository";
import { Seller, Product } from "../../interfaces/model/seller";

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
      
      const seller = await SellerModel.findOne({ UserID: userId }).exec();
      return seller;
    } catch (error) {
      console.error("Error checking if seller exists by UserID:", error);
      throw new Error("Failed to check seller existence.");
    }
  }


  async existsBySellerId(_id: string): Promise<Seller | null> {
    try {
     
      const seller = await SellerModel.findOne({_id }).exec();
      console.log(seller)
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
      const products = await ProductModel.find({ sellerId }).exec();
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

  async getProductById(productId: string): Promise<Product | null> {
    try {
      const result = await ProductModel.findById(productId);
      if (!result) {
        throw new Error("Product not found");
      }
      return result;
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw new Error("Failed to fetch product.");
    }
  }

  async getAll(): Promise<Product[]> {
    try {
      const products = await ProductModel.find().exec();
      return products;
    } catch (error) {
      console.error("Error getting all products:", error);
      throw new Error("Failed to get products.");
    }
  }
}

export default SellerRepository;
