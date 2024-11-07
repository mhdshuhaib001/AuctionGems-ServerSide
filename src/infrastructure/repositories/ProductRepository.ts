import { Product } from "../../interfaces/model/seller";
import ProductModel from "../../entities_models/productModal";
class ProductRepository {
  async insertOne(productData: Omit<Product, "_id">): Promise<Product> {
    try {
      const newProduct = new ProductModel(productData);
      console.log(newProduct, "this is on the newproduct on sellerusecase");
      await newProduct.save();

      return newProduct;
    } catch (error) {
      console.error("Error inserting product:", error);
      throw new Error("Failed to insert product.");
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

  async getProduct(productId: string): Promise<Product | null> {
    try {
      const productData = await ProductModel.findById(productId).populate(
        "categoryId",
        "name"
      );
      return productData;
    } catch (error) {
      console.error("Error fetching single product:", error);
      throw new Error("Failed to fetch product.");
    }
  }

  async findAll(): Promise<Product[]> {
    try {
      const products = await ProductModel.find().exec();
      console.log(products, "this is the products ");
      return products;
    } catch (error) {
      console.error("Error fetching  product:", error);
      throw new Error("Failed to fetch product.");
    }
  }
}

export default ProductRepository;
