import express from 'express'

import { Request,Response } from 'express'
import {productController} from '../../providers/controllers'; 


const route = express.Router()


const handleGetProduct = (req: Request, res: Response) =>
    productController.getProduct(req, res);

route.get("/:id", handleGetProduct);


export default route