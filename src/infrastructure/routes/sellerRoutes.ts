import express from "express";
import { Request, Response } from "express";
import { sellerController } from "../../providers/controllers";
import { userAuth } from "../../middilewares/RoleBaseAuth";
import {
  uploadSingleImage,
  uploadMultipleImages
} from "../../middilewares/multer";
const router = express.Router();
// router.use(userAuth(["seller", "admin"])); 
// Define route handlers
const handleSellerCreater = (req: Request, res: Response) =>
  sellerController.createSeller(req, res);
const handleCreateProduct = (req: Request, res: Response) =>
  sellerController.createProduct(req, res);

const handleSellerProductFetch = (req: Request, res: Response) =>
  sellerController.fetchSellerProducts(req, res);
const handleDeleteProduct = (req: Request, res: Response) =>
  sellerController.deleteProduct(req, res);

const handleFetchAllProduct = (req: Request, res: Response) =>
  sellerController.getAllProducts(req, res);
const handleUpdateSeller = (req: Request, res: Response) =>
  sellerController.updateSeller(req, res);
const handleSellerFetch = (req: Request, res: Response) =>
  sellerController.fetchSeller(req, res);
const handleGetAllOrders = (req: Request, res: Response) =>
  sellerController.getAllOrders(req, res);
const handleUpdateOrderStatus = (req: Request, res: Response) =>
  sellerController.updateOrderStatus(req, res);
const handleFetchAllSeller = (req: Request, res: Response) =>
  sellerController.fetchAllSellers(req, res);

const handleCreateReview = (req: Request, res: Response) =>
  sellerController.createReview(req, res);
const handleGetReviews = (req: Request, res: Response) =>
  sellerController.getReview(req, res);

const handleFetchFullSellerProfile = (req: Request, res: Response) =>
  sellerController.fetchFullSellerProfile(req, res);
const handlegetDashboardData = (req: Request, res: Response) =>
  sellerController.getDashboardData(req, res);
router.post("/createseller", handleSellerCreater);
router.put("/updateseller", uploadSingleImage, handleUpdateSeller);
router.post(
  "/createproduct",

  uploadMultipleImages,
  handleCreateProduct
);
router.get(
  "/fetchProducts/:sellerId",
  userAuth(["seller", "admin"]),
  handleSellerProductFetch
);
router.delete(
  "/deleteProduct/:productId",
  userAuth(["seller", "admin"]),
  handleDeleteProduct
);
// router.get("/fetchAllProducts", handleFetchAllProduct);
router.get("/orders/:sellerId", handleGetAllOrders);
router.get("/getproducts", handleFetchAllProduct);
router.put("/order/:orderId", handleUpdateOrderStatus);
router.get("/get-seller", handleFetchAllSeller);
router.get("/:sellerId", handleSellerFetch);
router.post("/review", handleCreateReview);
router.get("/review/:sellerId", handleGetReviews);
router.get("/:sellerId/full-profile", handleFetchFullSellerProfile);
router.get("/:sellerId/dashboard", handlegetDashboardData);
export default router;
