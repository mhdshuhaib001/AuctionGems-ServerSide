import express, { Request, Response, Router } from 'express';
import { chatController } from "../../providers/controllers";
const chatRoute = Router();


const handleSendMessage = (req:Request,res:Response)=> chatController.sendMessage(req,res)
const handleGetMessage = (req: Request, res: Response) => chatController.getMessages(req, res);
  const handleCreateChat  = (req:Request,res:Response)=>chatController.createChat(req,res);
  const handleChatBotMessage = (req:Request,res:Response)=> chatController.handleChatBotMessage(req,res);
  chatRoute.post('/create-room',handleCreateChat)
  chatRoute.post('/send-message',handleSendMessage);
chatRoute.get('/get-message/:senderId/:receiverId',handleGetMessage);
chatRoute.post('/chatbot',handleChatBotMessage)
export default chatRoute;   