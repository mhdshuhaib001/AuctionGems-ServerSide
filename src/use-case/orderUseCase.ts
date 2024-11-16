import mongoose from "mongoose";
import { OrderRepository } from "../infrastructure/repositories/OrderRepository";
import SellerRepository from "../infrastructure/repositories/SellerRepository";
import UserRepository from "../infrastructure/repositories/UserRepositories";
import IOrderUsecase from "../interfaces/iUseCases/iOrderUseCase";
import { ISellerRevenue } from "../interfaces/model/ISellerRevenue";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

class OrderUsecase implements IOrderUsecase {
  constructor(
    private readonly _orderRepository: OrderRepository,
    private readonly _sellerRepository: SellerRepository,
    private readonly _userRepository: UserRepository
  ) {}

  // async createOrder(
  //     userId: string,
  //     sellerId: string,
  //     addressId: string,
  //     productId: string,
  // ): Promise<string> {
  //     try {
  //         const product = await this._sellerRepository.getProductById(productId);
  //         const address = await this._userRepository.getAddressById(addressId);
  //         if (!product) throw new Error("Product not found");
  //         if (!address) throw new Error("Address not found");

  async createOrder(
    userId: string,
    sellerId: string,
    addressId: string,
    productId: string
  ): Promise<string> {
    try {
      const product = await this._sellerRepository.getProductById(productId);
      const address = await this._userRepository.getAddressById(addressId);

      if (!product) throw new Error("Product not found");
      if (!address) throw new Error("Address not found");
      if (!product.reservePrice)
        throw new Error("Reserve price is missing for the product");

      const reservePrice = Math.floor(Number(product.reservePrice) || 0);

      const orderData = {
        productId,
        buyerId: userId,
        sellerId,
        bidAmount: reservePrice,
        shippingAddress: {
          fullName: address.fullName,
          phoneNumber: address.phoneNumber,
          streetAddress: address.streetAddress,
          city: address.city,
          state: address.state,
          postalCode: address.postalCode,
          country: address.country
        },
        shippingType: "standard",
        paymentStatus: "pending",
        orderStatus: "pending"
      };

      const order = await this._orderRepository.saveOrder(orderData);

      const platformFeePercentage = 0.02;
      const platformFee = reservePrice * platformFeePercentage;
      const sellerEarnings = reservePrice - platformFee;

      const revenueData = {
        orderId: new mongoose.Types.ObjectId(order._id),
        productId: new mongoose.Types.ObjectId(productId),
        sellerId: new mongoose.Types.ObjectId(sellerId),
        platformFee,
        sellerEarnings
      } as ISellerRevenue;

      await this._orderRepository.sellerRevenue(revenueData);

      return order._id;
    } catch (error: unknown) {
      console.error(
        "Error during order creation:",
        error instanceof Error ? error.message : error
      );
      throw new Error(
        "Order creation failed: " +
          (error instanceof Error ? error.message : "An unknown error occurred")
      );
    }
  }

  async createCheckoutSession(
    image: string,
    name: string,
    price: number,
    orderId: string
  ): Promise<any> {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        metadata: {
          orderId: orderId
        },
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                images: [image],
                name: name
              },
              unit_amount: price * 100
            },
            quantity: 1
          }
        ],
        mode: "payment",
        success_url:
          process.env.FRONTEND_SUCCESS_URL || "http://localhost:5173/success",
        cancel_url:
          process.env.FRONTEND_CANCEL_URL || "http://localhost:5173/cancel"
      });
      return session.id;
    } catch (error: unknown) {
      console.error("Error creating checkout session:", error);
      if (error instanceof Error) {
        throw new Error("Checkout session creation failed: " + error.message);
      } else {
        throw new Error(
          "Checkout session creation failed: An unknown error occurred"
        );
      }
    }
  }

  async fetchOrderByUserId(userId: string): Promise<any | null> {
    try {
      const order = await this._orderRepository.fetchOrderByUserId(userId);
      const product = await this._sellerRepository.getProductById(
        order.productId
      );
      const seller = await this._sellerRepository.getSellerByUserId(
        order.sellerId
      );
      const address = await this._userRepository.getAddressById(
        order.addressId
      );
      if (product) {
        const responseData = {
          orderId: order.id,
          orderDate: order.orderDate,
          status: order.status,
          bidAmount: product.reservePrice,
          productId: product._id,
          productName: product.itemTitle || null,
          productImage: (product as any).images || null,
          description: product.description || null,
          companyName: (seller?.companyName as string) || "Unknown Seller",
          paymentStatus: order.paymentStatus
        };

        return responseData;
      } else {
        throw new Error("Product not found");
      }
    } catch (error) {
      console.error("Error fetching order by user ID:", error);
      throw new Error("Failed to fetch order by user ID");
    }
  }

  async fetchOrderById(orderId: string): Promise<any | null> {
    try {
      const order = await this._orderRepository.fetchOrderById(orderId);
      if (!order || order.length === 0) {
        return [];
      }
      const product = await this._sellerRepository.getProductById(
        order.productId
      );

      if (!product) {
        throw new Error("Product not found");
      }

      const responseData = {
        orderId: order._id,
        orderDate: order.orderDate,
        status: order.orderStatus,
        bidAmount: order.bidAmount,
        productId: product._id,
        productName: product.itemTitle || null,
        productImage: product.images || null,
        description: product.description || null,
        companyName: product.sellerId?.companyName || "Unknown Seller",
        sellerId: product.sellerId?._id || null,
        profileName: product.sellerId?.profile || null,
        paymentStatus: order.paymentStatus,
        shippingAddress: order.shippingAddress
      };

      return responseData;
    } catch (error) {
      console.error("Error fetching order by order ID:", error);
      throw new Error("Failed to fetch order by order ID");
    }
  }

  async execute(revenueData: ISellerRevenue): Promise<ISellerRevenue> {
    try {
      const revenue = await this._orderRepository.sellerRevenue(revenueData);
      return revenue;
    } catch (error) {
      throw new Error("Failed to add seller revenue");
    }
  }
}

export { OrderUsecase };
