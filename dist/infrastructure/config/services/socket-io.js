"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearSocketInstance = exports.getSocketInstance = exports.socketIoInit = void 0;
const socket_io_1 = require("socket.io");
const chatUseCase_1 = __importDefault(require("../../../use-case/chatUseCase"));
const ChatRepository_1 = __importDefault(require("../../repositories/ChatRepository"));
const SellerRepository_1 = __importDefault(require("../../repositories/SellerRepository"));
const sellerModel_1 = __importDefault(require("../../../entities_models/sellerModel"));
let io = null;
const onlineUsers = new Map();
const chatRepository = new ChatRepository_1.default();
const sellerRepository = new SellerRepository_1.default();
const chatUseCase = new chatUseCase_1.default(chatRepository, sellerRepository);
const generateRoomId = (id1, id2) => {
    return [id1, id2].sort().join("-");
};
const socketIoInit = (HttpServer) => {
    // this is soccket connecting area 
    io = new socket_io_1.Server(HttpServer, {
        cors: {
            origin: "https://auction-gemss.vercel.app",
            methods: ["GET", "POST"],
            credentials: true
        },
        path: "/socket.io",
        transports: ["websocket", "polling"]
    });
    io.on("connection", (socket) => {
        socket.on("user_connected", (userId) => {
            onlineUsers.set(userId, socket.id);
            io === null || io === void 0 ? void 0 : io.emit("user_online", userId);
        });
        socket.on("check_seller_block_status", (sellerId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const seller = yield sellerModel_1.default.findById(sellerId);
                if (seller && seller.isBlocked) {
                    socket.emit("seller_blocked", {
                        sellerId,
                        message: "Your account has been blocked due to multiple reports."
                    });
                }
            }
            catch (error) {
                console.error("Error checking seller block status:", error);
            }
        }));
        socket.on("send_message", (message) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                yield chatUseCase.sendMessage(message.senderId, message.receiverId, message.message);
                const roomId = generateRoomId(message.senderId, message.receiverId);
                io === null || io === void 0 ? void 0 : io.to(roomId).emit("receive_message", message);
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
                        io === null || io === void 0 ? void 0 : io.to(receiverSocketId).emit("new_message_notification", notification);
                    }
                    else {
                        console.warn(`No active socket found for user ${message.receiverId}`);
                    }
                }
            }
            catch (error) {
                console.error("Failed to process message:", error);
            }
        }));
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
            io === null || io === void 0 ? void 0 : io.to(bid.auctionId).emit("new_bid", bid);
        });
        socket.on("disconnect", () => {
            let disconnectedUserId;
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    disconnectedUserId = userId;
                    break;
                }
            }
            if (disconnectedUserId) {
                onlineUsers.delete(disconnectedUserId);
                io === null || io === void 0 ? void 0 : io.emit("user_offline", disconnectedUserId);
                console.log("Updated online users:", Array.from(onlineUsers.entries()));
            }
        });
    });
    return io;
};
exports.socketIoInit = socketIoInit;
const getSocketInstance = () => {
    if (!io) {
        throw new Error("Socket.io not initialized! Make sure to call socketIoInit first");
    }
    return io;
};
exports.getSocketInstance = getSocketInstance;
const clearSocketInstance = () => {
    io = null;
};
exports.clearSocketInstance = clearSocketInstance;
