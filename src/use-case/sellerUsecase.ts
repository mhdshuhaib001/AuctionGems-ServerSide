import SellerRepository from "../infrastructure/repositories/SellerRepository";
import userRepository from "../infrastructure/repositories/UserRepositories";
import JWT from "../providers/jwt";
import { Seller, SellerResponse } from "../interfaces/model/seller";
import cloudinary from "../infrastructure/config/cloudinary";
import ProductRepository from "../infrastructure/repositories/ProductListingRepository";
import { Product } from "../interfaces/model/seller";
class SellerUseCase {
  constructor(
    private readonly _SellerRepository: SellerRepository,
    private readonly _UserRepository: userRepository,
    private readonly _jwt: JWT,
    private readonly _ProductRepository: ProductRepository
  ) {}

  async createSeller(sellerData: Seller) {
    try {
      const existingName = await this._SellerRepository.findByName(
        sellerData.CompanyName
      );
      if (existingName) {
        return {
          status: 400,
          message: "Seller name already taken"
        };
      }
      const result = await this._SellerRepository.insertOne(sellerData);
      await this._UserRepository.updateRole(
        sellerData.UserID.toString(),
        "seller"
      );
      const sellerToken = this._jwt.createAccessToken(
        sellerData.UserID.toString(),
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

  async createProduct(
    productData: Product,
    images: string[]
  ): Promise<{ status: number; message: string; productData?: Product }> {
    try {
      console.log(productData, "this is the product Dataaaaaaaaaaaa");

      if (!Array.isArray(images) || images.length === 0) {
        throw new Error("No images provided");
      }

      // Upload each image (base64 string) to Cloudinary
      const uploadPromises = images.map((imageBase64) =>
        cloudinary.uploader.upload(imageBase64, {
          folder: "auction_gems/product_images"
        })
      );
      // cloudinary image adding area
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map(
        (result: { secure_url: string }) => result.secure_url
      );

      const updatedProductData: Product = {
        ...productData,
        images: imageUrls
      };

      const product =
        await this._ProductRepository.insertOne(updatedProductData);

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
      return {
        status: 200,
        message: "Products fetched successfully",
        products
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

  async getAllProducts(): Promise<{
    status: number;
    message: string;
    products?: Product[];
  }> {
    try {
      const products = await this._SellerRepository.getAll();
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
}

export default SellerUseCase;
