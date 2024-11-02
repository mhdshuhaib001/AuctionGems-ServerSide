import express from 'express'

import { Request,Response } from 'express'
import {productController} from '../../providers/controllers'; 


const route = express.Router()


const handleGetProduct = (req: Request, res: Response) =>
    productController.getProduct(req, res);
const handleGetProductById = (req:Request,res:Response)=>productController.getProductById(req,res)
const handleFetchAllProduct = (req:Request,res:Response)=>productController.getAllProducts(req,res)

route.get('/getallproduct',handleFetchAllProduct)
route.get("/:id", handleGetProduct);
route.get('/getProduct/:id',handleGetProductById)


export default route