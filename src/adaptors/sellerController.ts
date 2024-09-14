import { Seller } from "../interfaces/model/seller";
import SellerUseCase from "../use-case/sellerUsecase";

import { Request,Response } from "express";


class SellerController{
    constructor(
        private readonly _sellerUseCase: SellerUseCase,
    ){}

    async createSeller(req:Request,res:Response){
        try {
            const sellerData  = req.body
            console.log('Output:seller data', sellerData);

            const result = await this._sellerUseCase.createSeller(sellerData)
            res.status(result.status).json(result)
            
        } catch (error) {
            
        }
    }
  
}

export default SellerController