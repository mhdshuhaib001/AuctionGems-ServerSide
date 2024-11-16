"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const multer_1 = require("../../middilewares/multer");
const router = express_1.default.Router();
const handleGetAllUser = (req, res) => controllers_1.adminController.fetchUsers(req, res);
const handleUserBlockAndUnblock = (req, res) => controllers_1.adminController.updateUserActiveStatus(req, res);
const handleAddCategory = (req, res) => controllers_1.adminController.addCategory(req, res);
const handleGetAllCategory = (req, res) => controllers_1.adminController.getAllCategory(req, res);
const handleUpdateCategory = (req, res) => controllers_1.adminController.updateCategory(req, res);
const handleDeleteCategory = (req, res) => controllers_1.adminController.deleteCategory(req, res);
const handleReportAdd = (req, res) => controllers_1.adminController.addReport(req, res);
const handleGetReports = (req, res) => controllers_1.adminController.getReports(req, res);
const handleUpdateStatus = (req, res) => controllers_1.adminController.updateReportStatus(req, res);
const handleAuctionNotification = (req, res) => controllers_1.adminController.auctionNotification(req, res);
router.get('/get-user', handleGetAllUser);
router.post('/user-status', handleUserBlockAndUnblock);
router.post('/categories', multer_1.uploadFields, handleAddCategory);
router.get('/categories', handleGetAllCategory);
router.put('/categories/:id', multer_1.uploadFields, handleUpdateCategory);
router.delete('/categories/:id', handleDeleteCategory);
router.post('/report', handleReportAdd);
router.get('/getreports', handleGetReports);
router.patch('/status/:id', handleUpdateStatus);
router.post('/auction-notification', handleAuctionNotification);
exports.default = router;
