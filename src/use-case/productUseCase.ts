import IProductUseCase from "../interfaces/iUseCases/iProductUseCase";
import ProductRepository from "../infrastructure/repositories/ProductRepository";
import cloudinary from "../infrastructure/config/services/cloudinary";
import { Product } from "../interfaces/model/seller";
import SellerRepository from "../infrastructure/repositories/SellerRepository";

class ProductUseCase implements IProductUseCase {
  constructor(
    private readonly _ProductRepository: ProductRepository,
    private readonly _sellerRepository: SellerRepository
  ) {}



  async getProduct(productId: string): Promise<any> {
    try {
      const product = await this._ProductRepository.getProductById(productId);
      console.log(product, "product");
      if (!product) {
        return {
          status: 404,
          message: "Product not found"
        };
      }
      const sellerId = product.sellerId.toString();

      const seller = await this._sellerRepository.findById(sellerId);

      const sellerData = {
        sellerId: sellerId,
        companyName: seller?.companyName,
        address: seller?.address,
        phone: seller?.phone,
        profile: seller?.profile
      };
      console.log(sellerData, "sellerData");
      return {
        status: 200,
        message: "Product fetched successfully",
        productData: product,
        sellerData: sellerData
      };
    } catch (error) {
      console.error("Error getting product:", error);
      throw new Error("Failed to get product.");
    }
  }

  async getProductById(productId: string): Promise<Product> {
    const productData = await this._ProductRepository.getProduct(productId);
    console.log(productData, "this is the productData");
    if (!productData) {
      throw new Error("Product not found");
    }

    return productData;
  }

  async getProducts(): Promise<{
    status: string;
    products?: Product[];
    message?: string;
  }> {
    try {
      const products = await this._ProductRepository.findAll();
      return {
        status: "200",
        message: "All products fetched successfully",
        products
      };
    } catch (error) {
      return {
        status: "error",
        message: "Failed to fetch products"
      };
    }
  }


  async updateAuctionStatus(auctionId:string,status:string):Promise<void>{
    try {
      const validStatuses = ["sold", "live", "upcoming", "relisted", "end", "unsold"];
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid auction status");
      }

      const auction = await this._ProductRepository.getProductById(auctionId);
    if (!auction) {
      throw new Error("Auction not found");
    }

    if (auction.auctionStatus === "sold" || auction.auctionStatus === "relisted") {
      console.log("Cannot update status for sold or relisted auctions.");
      return;
    }

    // auction.auctionStatus = status;
    // await this._ProductRepository.updateAuction(auctionId, { auctionStatus: status });
    } catch (error) {
      
    }
  }
}

export default ProductUseCase;
