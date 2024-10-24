import express from 'express'
import { Request, Response } from "express-serve-static-core";
import { auctionController } from '../../providers/controllers';

const auctionRout = express.Router()


const handlePlaceBid = (req:Request,res:Response) => auctionController.placeBid(req,res);
const handleGetUsers = (req:Request,res:Response)=> auctionController.getBids(req,res)
auctionRout.post('/',handlePlaceBid)
auctionRout.get('/biddes/:id',handleGetUsers)


export default auctionRout