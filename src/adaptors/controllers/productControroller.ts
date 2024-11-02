import { Product } from "../../interfaces/model/seller";
import { Request, Response } from "express";
import ProductUseCase from "../../use-case/productUseCase";

class ProductController {
  constructor(private readonly _productUseCase: ProductUseCase) {}

  async getProduct(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const product = await this._productUseCase.getProduct(productId);
      res.status(product.status).json(product);
    } catch (error) {
      console.error("Error fetching product:", error);
      res.status(500).json({ message: "Error retrieving product." });
    }
  }
  async getProductById(req: Request, res: Response) {
    try {
      const productId = req.params.id;
      const productData = await this._productUseCase.getProductById(productId);

      if (!productData) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.status(200).json(productData);
    } catch (error) {
      console.error("Error fetching product:", error);
      return res.status(500).json({ message: "Failed to fetch product" });
    }
  }

  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await this._productUseCase.getProducts();
      console.log(products,'products get in here so what nxt then ?')
      res.status(200).json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch products" });
    }
  }
}

export default ProductController;
