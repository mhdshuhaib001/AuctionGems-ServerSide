import { Product } from "../../interfaces/model/seller";
import ProductModel from "../../entities_models/productModal";
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


  async getProductById(productId: string): Promise<Product | null> {
    try {
      const result = await ProductModel.findById({_id:productId});
      if (!result) {
        throw new Error("Product not found");
      }
      return result;
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw new Error("Failed to fetch product.");
    }
  }
}

export default ProductRepository;
