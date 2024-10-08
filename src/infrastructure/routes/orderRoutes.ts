import express, { Request, Response } from 'express';
import { orderController } from '../../providers/controllers';

const router = express.Router();

const handleCreateOrder = (req: Request, res: Response) => {
    console.log("Received a request to create an order:", req.body); 
    orderController.createOrder(req, res);
};

const handleCreateCheckoutSession = (req: Request, res: Response) => {
    console.log("Received a request to create a checkout session:", req.body); 
    orderController.createCheckoutSession(req, res);
    };

const handleFetchOrderByUserId = (req: Request, res: Response) => {
    console.log("Received a request to fetch order by user ID:", req.params); 
    orderController.fetchOrderByUserId(req, res);
};

const handleFetchOrderById = (req: Request, res: Response) => {
    console.log("Received a request to fetch order by ID:", req.params); 
    orderController.fetchOrderById(req, res);
};

router.post('/checkout-session', handleCreateCheckoutSession);
router.post('/payment-intent', handleCreateOrder);
router.get('/user-orders/:userId', handleFetchOrderByUserId);
router.get('/order-details/:orderId', handleFetchOrderById);

export default router;
