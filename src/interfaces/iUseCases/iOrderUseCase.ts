import IOrder from "../model/order";

interface IOrderUsecase{
    createOrder(userId: string, cartId: string, addressId: string, paymentMethodId: string, orderData: any, paymentId: string): Promise<string>
    createCheckoutSession(image: string,name: string,price: number,orderId: string ,): Promise<string>
}

export default IOrderUsecase