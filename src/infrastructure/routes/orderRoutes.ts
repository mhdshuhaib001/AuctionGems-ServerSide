import express, { Request, Response } from "express";
import { orderController } from "../../providers/controllers";

const router = express.Router();

const handleCreateOrder = (req: Request, res: Response) =>
  orderController.createOrder(req, res);

const handleCreateCheckoutSession = (req: Request, res: Response) =>
  orderController.createCheckoutSession(req, res);

const handleFetchOrderByUserId = (req: Request, res: Response) =>
  orderController.fetchOrderByUserId(req, res);

const handleFetchOrderById = (req: Request, res: Response) =>
  orderController.fetchOrderById(req, res);
const handleAddRevanue = (req:Request,res:Response)=>orderController.createSellerRevenue(req,res)

router.post("/checkout-session", handleCreateCheckoutSession);
router.post("/payment-intent", handleCreateOrder);
router.get("/user-orders/:userId", handleFetchOrderByUserId);
router.get("/order-details/:orderId", handleFetchOrderById);
router.post('/seller-revenue',handleAddRevanue);


export default router;
