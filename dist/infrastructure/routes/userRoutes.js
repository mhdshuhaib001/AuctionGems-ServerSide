"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const multer_1 = require("../../middilewares/multer");
const route = express_1.default.Router();
const handleAddAddress = (req, res) => controllers_1.userController.addAddress(req, res);
const handleGetAddress = (req, res) => controllers_1.userController.getAddress(req, res);
const handleGetAllAddress = (req, res) => controllers_1.userController.getAllAddress(req, res);
const handleUpdateUser = (req, res) => controllers_1.userController.updateUser(req, res);
const handleGetUser = (req, res) => controllers_1.userController.getUser(req, res);
const handleUpdateAddress = (req, res) => controllers_1.userController.updateAddress(req, res);
const handleDeleteAddress = (req, res) => controllers_1.userController.deleteAddress(req, res);
const handleGetCategory = (req, res) => controllers_1.userController.getCategory(req, res);
const handleNotifyAuctionStart = (req, res) => controllers_1.userController.notifyAuctionStart(req, res);
// const handleAuctionNotification = (req:Request,res:Response)=>userController.auctionNotification(req,res);
const handleChangePassword = (req, res) => controllers_1.userController.changePassword(req, res);
const handleGetAuctionHistory = (req, res) => controllers_1.userController.getUserAuctionHistory(req, res);
route.post("/address", handleAddAddress);
route.get("/address", handleGetAllAddress);
route.get("/address/:id", handleGetAddress);
route.put("/user", multer_1.uploadSingleImage, handleUpdateUser);
route.get("/user/:id", handleGetUser);
route.put("/address/:id", handleUpdateAddress);
route.delete("/address/:id", handleDeleteAddress);
route.get('/categories', handleGetCategory);
// route.post('/subscribe-notification',handleAuctionNotification)
// route.post('/auctionNotification',handleAuctionNotification)
route.post('/change-password', handleChangePassword);
route.get('/auction-history', handleGetAuctionHistory);
exports.default = route;
