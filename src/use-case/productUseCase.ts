import IProductUseCase from "../interfaces/iUseCases/iProductUseCase";
import ProductRepository from "../infrastructure/repositories/ProductRepository";
import cloudinary from "../infrastructure/config/cloudinary";
import { Product } from "../interfaces/model/seller";
import SellerRepository from "../infrastructure/repositories/SellerRepository";

class ProductUseCase implements IProductUseCase{

    constructor(
        private readonly _ProductRepository: ProductRepository,
        private readonly _sellerRepository: SellerRepository
    ){}

    // async createProduct(
    //     productData: Product,
    //     images: string[]
    //   ): Promise<{ status: number; message: string; productData?: Product }> {
    //     try {
    //       // console.log(productData, "this is the product Dataaaaaaaaaaaa");
    
    //       if (!Array.isArray(images) || images.length === 0) {
    //         throw new Error("No images provided");
    //       }
    
    //       // Upload each image (base64 string) to Cloudinary
    //       const uploadPromises = images.map((imageBase64) =>
    //         cloudinary.uploader.upload(imageBase64, {
    //           folder: "auction_gems/product_images"
    //         })
    //       );
    //       // cloudinary image adding area
    //       const uploadResults = await Promise.all(uploadPromises);
    //       const imageUrls = uploadResults.map(
    //         (result: { secure_url: string }) => result.secure_url
    //       );
    
    //       const updatedProductData: Product = {
    //         ...productData,
    //         images: imageUrls
    //       };
    
    //       const product =
    //         await this._ProductRepository.insertOne(updatedProductData);
    
    //       return {
    //         status: 201,
    //         message: "Product created successfully",
    //         productData: product
    //       };
    //     } catch (error) {
    //       console.error("Error creating product:", error);
    //       throw new Error("Failed to create product.");
    //     }
    //   }
    
    async getProduct(productId: string): Promise<any> {
        try {
          const product = await this._ProductRepository.getProductById(productId);
          console.log(product,'product')
          if (!product) {
            return {
              status: 404,
              message: "Product not found"
            };
          }
          const sellerId = product.sellerId.toString()
    
          const seller = await this._sellerRepository.findById(sellerId);

          const sellerData = {
            sellerId:sellerId,
            companyName:seller?.companyName,
            address:seller?.address,
            phone:seller?.phone,
            profile:seller?.profile
          }
          console.log(sellerData,'sellerData')
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
}


export default ProductUseCase;
