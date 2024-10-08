import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import Stripe from 'stripe';
import { OrderRepository } from '../repositories/OrderRepository';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2024-09-30.acacia',
});

// Stripe webhook secret
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

// Middleware to handle raw body for Stripe webhook
router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  console.log('Webhook called:===============================================================', req.body.toString()); // Log the raw body for debugging

  const sig = req.headers['stripe-signature'] as string;
  let event = req.body

  // try {
  //   // Verify the webhook signature using the raw body
  //   event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  // } catch (err: any) {
  //   console.error(`⚠️ Webhook signature verification failed.`, err.message);
  //   return res.status(400).send(`Webhook Error: ${err.message}`);
  // }

  // Handle the event type

  if (event.type === 'checkout.session.completed') {
    const checkoutSession = event.data.object as Stripe.Checkout.Session;
    const orderId = checkoutSession.metadata?.orderId;
    console.log(orderId,'orderId============================================');
    const orderRepository = new OrderRepository();
    try {
      console.log('Checkout session completed:', checkoutSession.id);
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
