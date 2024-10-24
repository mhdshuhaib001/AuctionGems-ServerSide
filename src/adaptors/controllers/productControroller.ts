import { Product } from "../../interfaces/model/seller";
import { Request, Response } from "express";
import ProductUseCase from "../../use-case/productUseCase";

class ProductController {
    constructor(
        private readonly _productUseCase : ProductUseCase
    ) {}

    async getProduct(req: Request, res: Response) {
        try {
            const productId = req.params.id;
    console.log(productId,'========================')
            const product = await this._productUseCase.getProduct(productId);
            res.status(product.status).json(product);
        } catch (error) {
            console.error("Error fetching product:", error);
            res.status(500).json({ message: "Error retrieving product." });
        }
    }
    

}

export default ProductController;
