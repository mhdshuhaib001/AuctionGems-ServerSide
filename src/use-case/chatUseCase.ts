import { Types } from "mongoose";
import ChatRepository from "../infrastructure/repositories/ChatRepository";
import IChatUseCase from "../interfaces/iUseCases/iChatUseCase";
import SellerRepository from "../infrastructure/repositories/SellerRepository";
import { model, generationConfig } from "../infrastructure/config/chatbotConfig";

const chatSession = model.startChat({
  generationConfig,
  history: [], 
});

class ChatUseCase implements IChatUseCase {
  constructor(
    private readonly _chatRepository: ChatRepository,
    private readonly _sellerRepository: SellerRepository
  ) {}

  // async createChat(
  //   userId: string,
  //   receiverId: string
  // ): Promise<{ chatId: string; messages: any[] }> {
  //   console.log("Creating chat session...");

  //   // Check if the receiver is a seller
  //   const isReceiverSeller = await this._sellerRepository.findById(receiverId);
  //   console.log(`Is receiver a seller? ${isReceiverSeller}`);

  //   const result = await this._chatRepository.createRoom(
  //     userId,
  //     receiverId,
  //     !!isReceiverSeller
  //   );
  //   console.log(`Chat room created: ${result.chatId}`);

  //   return {
  //     chatId: result.chatId,
  //     messages: result.message
  //   };
  // }

  async sendMessage(
    sender: string,
    receiver: string,
    message: string
  ): Promise<void> {
    console.log("Sending message...");
    const chat = {
      senderId: sender,
      recipientId: receiver,
      message: message,
      createdAt: new Date()
    };
    await this._chatRepository.sendMessage(chat);
    console.log("Message sent successfully.");
  }

  async getMessages(sender: string, receiver: string): Promise<any> {
    console.log("Fetching messages...");
    const messages = await this._chatRepository.getMessages(sender, receiver);
    console.log("Messages retrieved successfully.");
    return messages;
  }

  async chatBot(message: string, itemDetails: any): Promise<any> {
    try {
      const itemInfo = itemDetails
        ? `You have information about the following item: ${JSON.stringify(itemDetails)}.`
        : "No specific item details were provided.";

      const context = `
        You are Aura, an AI assistant for a vintage auction website. 
        Here are the services we provide:
        - Auctioning vintage items
        - Facilitating buyer-seller interactions
        - Providing customer support
        - Managing a bidding system
        - Sending auction event notifications

        ${itemInfo}
        Please respond to user questions based on the above context, maintaining a friendly and helpful tone.
      `;

      const result = await chatSession.sendMessage(`${context}\n\nHuman: ${message}`);
      const response = await result.response.text();

      return response;
    } catch (error) {
      console.error("Error in chatBot function:", error);
      throw new Error("Failed to interact with the chatbot.");
    }
  }
}

export default ChatUseCase;
