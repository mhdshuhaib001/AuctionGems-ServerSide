import  express  from "express";
import { Request,Response } from "express";
import {sellerController} from '../../providers/controllers'
import { productController } from "../../providers/controllers";
// import productController from "../../providers/productControroller";


const router = express.Router()

const handleSellerCreater = (req:Request,res:Response)=> sellerController.createSeller(req,res)
const handleCreateProduct = (req:Request,res:Response)=> productController.createProduct(req,res)


router.post('/createseller',handleSellerCreater)
router.post('/createproduct',handleCreateProduct)

export default router