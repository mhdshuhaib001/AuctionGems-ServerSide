import IChatRepository from "../../interfaces/iRepositories/iChatRepository";
import Message from "../../entities_models/messageModal";
import Chat from "../../interfaces/model/chat";
import { ChatModel } from "../../entities_models/chatModale";
import { UserModel } from "../../entities_models/userModel";
import SellerModel from "../../entities_models/sellerModel";
class ChatRepository implements IChatRepository {



  async createRoom(
    userId: string,
    receiverId: string,
    isReceiverSeller: boolean
  ): Promise<{ chatId: string; message: any[]; user: any }> {
    try {
      console.log(`Fetching user data for userId: ${userId}`);
      const userData = await UserModel.findById(userId);
      if (!userData) {
        throw new Error(`User not found with userId: ${userId}`);
      }

      console.log(
        `Fetching receiver data for receiverId: ${receiverId} and isReceiverSeller: ${isReceiverSeller}`
      );
      const receiverData = isReceiverSeller
        ? await SellerModel.findById(receiverId)
        : await UserModel.findById(receiverId);
console.log(receiverData,'this is for the resiver id ')
      if (!receiverData) {
        throw new Error(
          `Receiver not found with receiverId: ${receiverId} and isReceiverSeller: ${isReceiverSeller}`
        );
      }

      let chat = await ChatModel.findOne({userId:userId,receiverId:receiverData._id})

      if(!chat){
        const chatName =
        isReceiverSeller && "companyName" in receiverData
          ? `Chat between ${userData.name} and Seller ${receiverData.companyName}`
          : `Chat between ${userData.name} and `;

     chat = await ChatModel.create({
        chatName: chatName || "Unnamed Chat",
        userId: userData._id.toString(),
        receiverId: receiverData._id.toString(),
        latestMessage: []
      });
      }
   

      return {
        chatId: chat._id.toString(),
        message: chat.latestMessage,
        user: userData
      };
    } catch (error) {
      console.error("Error creating chat room:", error);
      throw new Error("Error creating the room for chat");
    }
  }

  async sendMessage(chat: Chat): Promise<Chat> {
    const newMessage = new Message({
      senderId: chat.senderId,
      recipientId: chat.recipientId,
      message: chat.message,
      createdAt: chat.createdAt
    });
    return await newMessage.save();
  }

  async getMessages(sender: string, receiver: string): Promise<Chat[]> {
    return await Message.find({
      $or: [
        { senderId: sender, recipientId: receiver },
        { senderId: receiver, recipientId: sender }
      ]
    }).sort({ createdAt: 1 });
  }
}

export default ChatRepository;
