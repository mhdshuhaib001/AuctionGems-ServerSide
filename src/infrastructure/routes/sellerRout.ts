import express from "express";
import { Request, Response } from "express";
import { sellerController } from '../../providers/controllers';
import { userAuth } from '../../middilewares/RoleBaseAuth';
import upload from "../../middilewares/multer";
const router = express.Router();

// Define route handlers
const handleSellerCreater = (req: Request, res: Response) =>
  sellerController.createSeller(req, res);
const handleCreateProduct = (req: Request, res: Response) =>
  sellerController.createProduct(req, res);
const handleSellerProductFetch = (req: Request, res: Response) =>
  sellerController.fetchSellerProducts(req, res);
const handleDeleteProduct = (req: Request, res: Response) =>
  sellerController.deleteProduct(req, res);
const handleGetProduct = (req: Request, res: Response) =>
  sellerController.getProduct(req, res);
const handleFetchAllProduct = (req: Request, res: Response) =>
  sellerController.getAllProduct(req, res);
const handleUpdateSeller= (req:Request,res:Response)=>{ console.log("Handling seller update", req.body),sellerController.updateSeller(req,res)}
const handleSellerFetch = (req:Request,res:Response)=>{sellerController.fetchSeller(req,res)}


router.post('/createseller',  handleSellerCreater);
router.put('/updateseller', upload.single('image'), handleUpdateSeller);
router.post('/createproduct', userAuth(['seller', 'admin']), handleCreateProduct);
router.get('/fetchProducts/:sellerId', userAuth(['seller', 'admin']), handleSellerProductFetch);
router.delete('/deleteProduct/:productId', userAuth(['seller', 'admin']), handleDeleteProduct);
router.get('/getProduct/:productId', handleGetProduct);
router.get('/fetchAllProducts', handleFetchAllProduct);
router.get('/fetchSeller/:sellerId', (req, res) => {
  const sellerId = req.params.sellerId; 
  console.log('Fetching seller with ID:', sellerId); 

  handleSellerFetch(req, res);
});

export default router;
