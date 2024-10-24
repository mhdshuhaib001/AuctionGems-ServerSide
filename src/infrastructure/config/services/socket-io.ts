import { Server as SocketIOServer } from "socket.io";
import { Server as HttpServer } from "http";
import ChatUseCase from "../../../use-case/chatUseCase";
import ChatRepository from "../../repositories/ChatRepository";
import SellerRepository from "../../repositories/SellerRepository";
const chatRepository = new ChatRepository();
const sellerRepository = new SellerRepository();
const chatUseCase = new ChatUseCase(chatRepository, sellerRepository);
const generateRoomId = (id1: string, id2: string) => {
  return [id1, id2].sort().join("-");
};

export const socketIoInit = (HttpServer: HttpServer) => {
  const io = new SocketIOServer(HttpServer, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    },
    path: "/socket.io",
    transports: ["websocket", "polling"]
  });

  io.on("connection", (socket) => {
    socket.on("send_message", async (message) => {
      // console.log("Message received:", message);
      try {
        await chatUseCase.sendMessage(
          message.senderId,
          message.receiverId,
          message.message
        );

        const roomId = generateRoomId(message.senderId, message.receiverId);
        // console.log(`Emitting message to room ${roomId}:`, message);
        // console.log(`User ${socket.id} joined room: ${roomId}`);

        // Emit the message to the correct room
        io.to(roomId).emit("receive_message", message);
      } catch (error) {
        console.error("Failed to process message:", error);
      }
    });

    socket.on("join chat", (userId, otherUserId) => {
      const roomId = generateRoomId(userId, otherUserId);
      socket.join(roomId);
      // console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // User joins an auction room
    socket.on("join_auction", (auctionId, userId) => {
      console.log("user joined to the room");
      socket.join(auctionId);
    });

    socket.on("place_bid", (bid) => { 
      // console.log("bid==========================", bid);
      io.to(bid.auctionId).emit("new_bid", bid);
    });

    socket.on("typing", (room) => socket.in(room).emit("typing"));
    socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};
