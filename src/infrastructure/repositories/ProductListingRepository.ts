import SellerModel, { ProductModel } from "../../entities_models/sellerModel";
import { Product } from "../../interfaces/model/seller";

class ProductRepository {
  async insertOne(productData: Omit<Product, "_id">): Promise<Product> {
    try {
      const newProduct = new ProductModel(productData);
      await newProduct.save();

      return newProduct;
    } catch (error) {
      console.error("Error inserting product:", error);
      throw new Error("Failed to insert product.");
    }
  }
}

export default ProductRepository;
