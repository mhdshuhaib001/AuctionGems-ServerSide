import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import { OrderRepository } from '../../repositories/OrderRepository';


const router = express.Router();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {

  const sig = req.headers['stripe-signature'] as string;
  let event = req.body



  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const orderId = checkoutSession.metadata?.orderId;
    const orderRepository = new OrderRepository();
    try {
      const order = await orderRepository.findOrderId(orderId as string);
      if (order) {
        order.paymentStatus = 'paid';
        await orderRepository.updateOrder(order);
        console.log(`Order ${order.id} updated to 'paid'.`);  
      } else {
        console.error(`Order not found for payment ID: ${checkoutSession.id}`);
      }
    } catch (error) {
      console.error(`Error updating order:`, error);
      return res.status(500).send('Error updating order');
    }
  }
    

  res.status(200).json({ received: true });
});

export default router;
