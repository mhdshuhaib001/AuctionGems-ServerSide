"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controllers_1 = require("../../providers/controllers");
const chatRoute = (0, express_1.Router)();
const handleSendMessage = (req, res) => controllers_1.chatController.sendMessage(req, res);
const handleGetMessage = (req, res) => controllers_1.chatController.getMessages(req, res);
// const handleCreateChat  = (req:Request,res:Response)=>chatController.createChat(req,res);
const handleChatBotMessage = (req, res) => controllers_1.chatController.handleChatBotMessage(req, res);
// chatRoute.post('/create-room',handleCreateChat)
chatRoute.post('/send-message', handleSendMessage);
chatRoute.get('/get-message/:senderId/:receiverId', handleGetMessage);
chatRoute.post('/chatbot', handleChatBotMessage);
exports.default = chatRoute;
