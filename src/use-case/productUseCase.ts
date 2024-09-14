import cloudinary from "../infrastructure/config/cloudinary ";
import ProductRepository from "../infrastructure/repositories/ProductListingRepository";
import { Product } from "../interfaces/model/seller";

class ProductUseCase {
    constructor(
        private readonly _ProductRepository: ProductRepository,
    ) {}

    async createProduct(productData: Product, images: string[]): Promise<{ status: number; message: string; productData?: Product }> {
        try {

            if (!Array.isArray(images) || images.length === 0) {
                throw new Error('No images provided');
            }

            // Upload all images to Cloudinary
            const uploadPromises = images.map(image =>
                cloudinary.uploader.upload(image, {
                    folder: 'auction_gems/product_images',
                })
            );
            
            const uploadResults = await Promise.all(uploadPromises);
            const imageUrls = uploadResults.map((result: { secure_url: any; }) => result.secure_url);

            console.log(imageUrls, 'uploaded image URLs');

            const updatedProductData: Product = {
                ...productData,
                images: imageUrls
            };

            console.log(updatedProductData,'yuyutyuyt');
            

            const product = await this._ProductRepository.insertOne(updatedProductData);

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
}

export default ProductUseCase;
