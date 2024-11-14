import Chat from "../../interfaces/model/chat";

interface IChatRepository {
  getMessages(sender: string, receiver: string): Promise<Chat[]>;
}

export default IChatRepository;
