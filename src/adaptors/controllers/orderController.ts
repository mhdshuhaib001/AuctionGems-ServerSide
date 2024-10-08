import { OrderUsecase } from "../../use-case/orderUseCase";
import { Request, Response } from "express";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class OrderController {
  constructor(private readonly _orderUsecase: OrderUsecase) {}

  async createCheckoutSession(req: Request, res: Response) {
    try {
      const { image,name,price ,orderId} = req.body;
      console.log(req.body,"orderId=============================================")
      // if (!product || !product.name || !product.price) {
      //   throw new Error(
      //     "Invalid product details. Please ensure 'name' and 'price' are provided."
      //   );
      // }

      const sessionId = await this._orderUsecase.createCheckoutSession(image,name,price,orderId);

      res.status(200).json({ id: sessionId });
    } catch (error: unknown) {
      console.error("Error creating checkout session:", error);
      res
        .status(500)
        .json({
          message:
            error instanceof Error ? error.message : "Internal server error"
        });
    }
  }

  async createOrder(req: Request, res: Response) {
    try {
      const { buyerId, sellerId, addressId, productId } =
        req.body;
        console.log(req.body,"req.body=============================================")
    //   console.log("Creating order with data:", {
    //     buyerId,
    //     sellerId,
    //     addressId,
    //     paymentMethodId,
    //     productId
    //   });

      const result = await this._orderUsecase.createOrder(
        buyerId,
        sellerId,
        addressId,
        
        productId
      );
      res.status(200).json(result);
    } catch (error) {
      console.error("Error creating order:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }

  async fetchOrderByUserId(req: Request, res: Response) {
    try {
      const userId   = req.params.userId;
      console.log(userId, "userId");
      const order = await this._orderUsecase.fetchOrderByUserId(userId);
      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order by user ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  async fetchOrderById(req: Request, res: Response) {
    try {
      const orderId = req.params.orderId;
      const order = await this._orderUsecase.fetchOrderById(orderId);
      res.status(200).json(order);
    } catch (error) {
      console.error("Error fetching order by ID:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
}

export default OrderController;
