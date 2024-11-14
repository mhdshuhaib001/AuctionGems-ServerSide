import { Request, Response } from "express";
import ChatUseCase from "../../use-case/chatUseCase";

class ChatController {
  constructor(private readonly _chatUseCase: ChatUseCase) {}

  // async createChat(req: Request, res: Response) {
  //   try {
  //     const userId = req.body.userId;
  //     const receiverId = req.body.selectedChatId;
  //     const result = await this._chatUseCase.createChat(userId, receiverId);
  //     console.log(result, "this is the result ");
  //     res.status(200).json(result);
  //   } catch (error) {
  //     console.error("Error in chat controller:", error);
  //     res.status(500).json({
  //       success: false,
  //       message: "An error occurred while initializing chat",
  //       error: error instanceof Error ? error.message : String(error)
  //     });
  //   }
  // }
  async sendMessage(req: Request, res: Response) {
    const { senderId, receiverId, message } = req.body;
    const response = await this._chatUseCase.sendMessage(
      senderId,
      receiverId,
      message
    );
    return res.status(200).json(response);
  }

  async getMessages(req: Request, res: Response) {
    try {
      const { senderId, receiverId } = req.params;
  
      const messages = await this._chatUseCase.getMessages(
        senderId,
        receiverId
      );
      return res.status(200).json(messages);
    } catch (error) {
      console.error("");
    }
  }

  async handleChatBotMessage(req: Request, res: Response) {
    try {
      const { message, itemDetails } = req.body;
      const response = await this._chatUseCase.chatBot(message, itemDetails);
      return res.status(200).json({ message: response });
    } catch (error) {
      console.error("Error in chatbot message handler:", error);
      res.status(500).json({ message: "Failed to interact with the chatbot." });
    }
  }
}

export default ChatController;
