import express from 'express';
import { Request, Response } from 'express-serve-static-core';
import {adminController} from '../../providers/controllers'; 
import {uploadFields} from '../../middilewares/multer';

const router = express.Router();

const handleGetAllUser = (req: Request, res: Response) => adminController.fetchUsers(req, res);
const handleUserBlockAndUnblock = (req:Request,res:Response) => adminController.updateUserActiveStatus(req,res);
const handleAddCategory = (req:Request,res:Response)=>  adminController.addCategory(req,res);
const handleGetAllCategory = (req:Request,res:Response)=>adminController.getAllCategory(req,res);
const handleUpdateCategory = (req: Request, res: Response) =>  adminController.updateCategory(req, res); 
const handleDeleteCategory = (req:Request,res:Response)=>adminController.deleteCategory(req,res);   
const handleSendNotification = (req:Request,res:Response)=>adminController.sendWatsappNotification(req,res)
const handleReportAdd = (req:Request,res:Response)=>adminController.addReport(req,res);
const handleGetReports = (req:Request,res:Response)=>adminController.getReports(req,res);
const handleUpdateStatus = (req:Request,res:Response)=>adminController.updateReportStatus(req,res)
const handleAuctionNotification = (req:Request,res:Response)=> adminController.auctionNotification(req,res)
router.get('/get-user', handleGetAllUser);
router.post('/user-status',handleUserBlockAndUnblock)
router.post('/categories', uploadFields, handleAddCategory);
router.get('/categories',handleGetAllCategory)
router.put('/categories/:id', uploadFields, handleUpdateCategory);
router.delete('/categories/:id',handleDeleteCategory);
router.post('/send-notification',handleSendNotification)
router.post('/report',handleReportAdd)
router.get('/getreports',handleGetReports)
router.patch('/status/:id', handleUpdateStatus);
router.post('/auction-notification',handleAuctionNotification)
export default router;
