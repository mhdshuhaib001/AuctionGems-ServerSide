import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import ChatUseCase from "../../../use-case/chatUseCase";
import ChatRepository from "../../repositories/ChatRepository";
import SellerRepository from "../../repositories/SellerRepository";
import SellerModel from "../../../entities_models/sellerModel";

let io: SocketIOServer | null = null;
const onlineUsers = new Map<string, string>();
const chatRepository = new ChatRepository();
const sellerRepository = new SellerRepository();
const chatUseCase = new ChatUseCase(chatRepository, sellerRepository);

const generateRoomId = (id1: string, id2: string) => {
  return [id1, id2].sort().join("-");
};

export const socketIoInit = (HttpServer: HttpServer) => {

  // this is soccket connecting area 
  io = new SocketIOServer(HttpServer, {
    cors: {
      origin: "https://auction-gemss.vercel.app",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: "/api/socket.io",
    transports: ["websocket", "polling"]
  });

  io.on("connection", (socket) => {
    socket.on("user_connected", (userId: string) => {
      onlineUsers.set(userId, socket.id);
      io?.emit("user_online", userId);
    });

    socket.on("check_seller_block_status", async (sellerId: string) => {
      try {
        const seller = await SellerModel.findById(sellerId);
        if (seller && seller.isBlocked) {
          socket.emit("seller_blocked", {
            sellerId,
            message: "Your account has been blocked due to multiple reports."
          });
        }
      } catch (error) {
        console.error("Error checking seller block status:", error);
      }
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
        console.log(message.receiverId, "this was the receive_Id");
        if (message.receiverId) {
          const notification = {
            id: Date.now().toString(),
            senderId: message.senderId,
            senderName: message.senderName,
            message: message.message,
            receiverId: message.receiverId,
            timestamp: new Date().toISOString(),
            type: "message",
            isRead: false,
            senderRole: message.senderRole
          };
          console.log("Sending notification to:", message.receiverId);
          console.log("Notification details:", notification);

          const receiverSocketId = onlineUsers.get(message.receiverId);

          if (receiverSocketId) {
            io
              ?.to(receiverSocketId)
              .emit("new_message_notification", notification);
          } else {
            console.warn(
              `No active socket found for user ${message.receiverId}`
            );
          }
        }
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });

    socket.on("typing", ({ userId, room }) => {
      socket.to(room).emit("typing", { userId, room });
    });

    socket.on("stop_typing", ({ userId, room }) => {
      socket.to(room).emit("stop_typing", { userId, room });
    });

    socket.on("join chat", (userId, otherUserId) => {
      const roomId = generateRoomId(userId, otherUserId);
      socket.join(roomId);
    });

    socket.on("join_auction", (auctionId, userId) => {
      socket.join(auctionId);
    });

    socket.on("place_bid", (bid) => {
      io?.to(bid.auctionId).emit("new_bid", bid);
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
    throw new Error(
      "Socket.io not initialized! Make sure to call socketIoInit first"
    );
  }
  return io;
};

export const clearSocketInstance = () => {
  io = null;
};
