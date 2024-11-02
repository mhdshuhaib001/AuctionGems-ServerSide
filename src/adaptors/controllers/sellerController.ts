import { Seller } from "../../interfaces/model/seller";
import SellerUseCase from "../../use-case/sellerUsecase";

import { Request, Response } from "express";

class SellerController {
  constructor(private readonly _sellerUseCase: SellerUseCase) {}

  async createSeller(req: Request, res: Response) {
    try {
      const sellerData = req.body;

      const result = await this._sellerUseCase.createSeller(sellerData);
      res.status(result.status).json(result);
    } catch (error) {}
  }

  async createProduct(req: Request, res: Response) {
    try {
      const productData = req.body;
      console.log(productData,'0000000000000000000000000000000000000000000000')
      const sellerId = req.body.sellerId;
      const imagesFile = req.files as Express.Multer.File[];

      // Process images and convert to buffers if storing directly in DB
      const images = imagesFile.map((file) => file.buffer);      

      const result = await this._sellerUseCase.createProduct(
        productData,
        images
      );

      res
        .status(result.status)
        .json({ message: result.message, productData: result.productData });
    } catch (error) {
      console.error("Error creating product:", error);
      res.status(500).json({ message: "Error creating product." });
    }
  }

  async updateSeller(req: Request, res: Response) {
    try {
      console.log(req.body, "req.body--------------------");
      console.log(req.file, "req.file--------------------");
      const sellerData = req.body;
      const image = req.file || null;

      const response = await this._sellerUseCase.updateSeller(
        sellerData,
        image
      );

      // Send the full response back to the client
      res.status(response.status).json(response);
    } catch (error) {
      console.error("Error updateSeller.", error);

      // Handle error response correctly
      res.status(500).json({ message: "Error updateSeller." });
    }
  }

  async fetchSellerProducts(req: Request, res: Response) {
    try {
      const sellerId = req.params.sellerId;
      const products = await this._sellerUseCase.fetchSellerProducts(sellerId);
      res.status(products.status).json(products);
    } catch (error) {
      console.error("Error product:", error);
      res.status(500).json({ message: "Error creating product." });
    }
  }

  async deleteProduct(req: Request, res: Response) {
    try {
      const productId = req.params.productId;
      console.log(productId, "controllers productId ");
      const response = await this._sellerUseCase.deleteProduct(productId);
      res.status(response.status).json({ response });
    } catch (error) {
      console.error("Error product:", error);
      res.status(500).json({ message: "Error product removeing time." });
    }
  }


  async getAllProducts(req: Request, res: Response) {
    const { page = 1, limit = 10 } = req.query;
console.log(req.query,'===========================================')
    // Convert to integers
    const pageNumber = parseInt(page as string, 10) || 1; 
    const limitNumber = parseInt(limit as string, 10) || 10;

    try {
        const products = await this._sellerUseCase.getAllProducts(pageNumber, limitNumber);
        res.status(200).json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Error fetching products." });
    }
}

  

  async fetchSeller(req: Request, res: Response) {
    try {
      
      const sellerId = req.params.sellerId;
      const response = await this._sellerUseCase.fetchSeller(sellerId);
      return res.status(response.status).json(response);
    } catch (error) {
      console.error("Error fetching seller:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching the seller" });
    }
  }

  async getAllOrders(req: Request, res: Response) {
    try {
      const sellerId = req.params.sellerId;
      const response = await this._sellerUseCase.getAllOrders(sellerId);
      
      return res.status(response.status).json(response);
    } catch (error) {
      console.error("Error fetching orders:", error);
      return res
        .status(500)
        .json({ message: "An error occurred while fetching the orders" });
    }
  }

  async updateOrderStatus(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const newStatus = req.body.status;
      const response = await this._sellerUseCase.updateOrderStatus(
        orderId,
        newStatus
      );
      return res.status(response.status).json(response);
    } catch (error) {
      console.error("Error updating order status:", error);
      return res.status(500).json({ message: "Failed to update order status" });
    }
  }

  async fetchAllSellers(req:Request,res:Response){
    try {
      const response = await this._sellerUseCase.fetchAllSeller()
      return res.status(200).json(response)
    } catch (error) {
      console.log('fetch All seller')
      return res.status(500).json({ message: "Failed to fetch all seller" });

    }
  }
}

export default SellerController;
