"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const controllers_1 = require("../../providers/controllers");
const auctionRout = express_1.default.Router();
const handlePlaceBid = (req, res) => controllers_1.auctionController.placeBid(req, res);
const handleGetUsers = (req, res) => controllers_1.auctionController.getBids(req, res);
const handleCheckWinner = (req, res) => controllers_1.auctionController.auctionWinnerCheck(req, res);
const handleAuctionHistorycreate = (req, res) => controllers_1.auctionController.createAuctionHistory(req, res);
auctionRout.post('/', handlePlaceBid);
auctionRout.get('/biddes/:id', handleGetUsers);
auctionRout.post('/:auctionId/winner', handleCheckWinner);
auctionRout.post('/acution-history', handleAuctionHistorycreate);
exports.default = auctionRout;
