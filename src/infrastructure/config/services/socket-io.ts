import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import ChatUseCase from "../../../use-case/chatUseCase";
import ChatRepository from "../../repositories/ChatRepository";
import SellerRepository from "../../repositories/SellerRepository";

let io: SocketIOServer | null = null;
const onlineUsers = new Map<string, string>();
const chatRepository = new ChatRepository();
const sellerRepository = new SellerRepository();
const chatUseCase = new ChatUseCase(chatRepository, sellerRepository);

const generateRoomId = (id1: string, id2: string) => {
  return [id1, id2].sort().join("-");
};

export const socketIoInit = (HttpServer: HttpServer) => {
  io = new SocketIOServer(HttpServer, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ["GET", "POST"],
      credentials: true
    },
    path: "/socket.io",
    transports: ["websocket", "polling"]
  });

  io.on("connection", (socket) => {

    socket.on("user_connected", (userId: string) => {
      console.log("User connected event received:", userId);
      onlineUsers.set(userId, socket.id);
      console.log("Current online users:", Array.from(onlineUsers.entries()));
      io?.emit("user_online", userId);
  });


    socket.on("send_message", async (message) => {
      try {
        await chatUseCase.sendMessage(
          message.senderId,
          message.receiverId,
          message.message
        );

        const roomId = generateRoomId(message.senderId, message.receiverId);
        io?.to(roomId).emit("receive_message", message);
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });

    socket.on("join chat", (userId, otherUserId) => {
      const roomId = generateRoomId(userId, otherUserId);
      socket.join(roomId);
    });

    socket.on("join_auction", (auctionId, userId) => {
      console.log("user joined to the room");
      socket.join(auctionId);
    });

    socket.on("place_bid", (bid) => { 
      io?.to(bid.auctionId).emit("new_bid", bid);
    });

    socket.on('typing', ({ userId, room }) => {
      socket.to(room).emit('typing', { userId, room });
    });
  
    socket.on('stop_typing', ({ userId, room }) => {
      console.log('typing stopped')
      socket.to(room).emit('stop_typing', { userId, room });
    });

       socket.on("disconnect", () => {
            let disconnectedUserId: string | undefined;
            
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    break;
                }
            }

            if (disconnectedUserId) {
              console.log("User disconnected:", disconnectedUserId);
              onlineUsers.delete(disconnectedUserId);
              io?.emit("user_offline", disconnectedUserId);
              console.log("Updated online users:", Array.from(onlineUsers.entries()));
          }
        });

  });

  return io;
};

export const getSocketInstance = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized! Make sure to call socketIoInit first");
  }
  return io;
};

export const clearSocketInstance = () => {
  io = null;
};