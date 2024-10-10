import OrderModel from "../../entities_models/orderModel";
// import { IOrder } from "../../interfaces/model/order";

class OrderRepository {

    async findOrderId(orderId: string): Promise<any | null> {
        try {
            const order = await OrderModel.findOne({ _id: orderId });
            return order;
        } catch (error) {
            console.error("Error finding order by payment ID:", error);
            throw new Error("Failed to find order by order ID");
        }
    }
    async saveOrder(orderData:  any): Promise<any> {
        try {
         
            const order = await OrderModel.create(orderData); 
            
            console.log("Order saved successfully:", order);

            return order;
        } catch (error) {
            // Handle errors
            console.error("Error saving order:", error);
            throw new Error("Failed to save order");
        }
    }

    async updateOrder(order: any): Promise<boolean> {
        try {
            await OrderModel.findByIdAndUpdate(order.id, order);
            return true;
        } catch (error) {
            console.error("Error updating order:", error);
            throw new Error("Failed to update order");
        }
    }

    async fetchOrderByUserId(userId: string): Promise<any | null> {
        try {
            const order = await OrderModel.findOne({ buyerId: userId });
            console.log(order,'order')
            return order;
        } catch (error) {
            console.error("Error finding order by user ID:", error);
            throw new Error("Failed to find order by user ID");
        }
    }
    async fetchOrderById(orderId: string): Promise<any | null> {
        try {
            const order = await OrderModel.findOne({ _id: orderId });
            return order;
        } catch (error) {
            console.error("Error finding order by order ID:", error);
            throw new Error("Failed to find order by order ID");
        }
    }
}

export { OrderRepository };
