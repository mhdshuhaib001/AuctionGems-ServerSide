import IChatRepository from "../../interfaces/iRepositories/iChatRepository";
import Message from "../../entities_models/messageModal";
import Chat from "../../interfaces/model/chat";
class ChatRepository implements IChatRepository {


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
