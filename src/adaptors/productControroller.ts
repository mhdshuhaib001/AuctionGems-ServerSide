import { Product } from "../interfaces/model/seller";
import ProductUseCase from "../use-case/productUseCase";
import { Request, Response } from "express";

class ProductController {
    constructor(
        private readonly _productUseCase: ProductUseCase
    ) {}

    async createProduct(req: Request, res: Response) {
        try {

            console.log(req.body,'haloooooooo')
            const productData = req.body;
            console.log(productData,'productData')
            const images: string[] = req.body.images;
            
            const result = await this._productUseCase.createProduct(productData, images);

            res.status(result.status).json({ message: result.message, productData: result.productData });
            
        } catch (error) {
            console.error("Error creating product:", error);
            res.status(500).json({ message: "Error creating product." });
        }
    }
}

export default ProductController;
