"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSocketInstance = exports.initSocket = void 0;
// socketService.ts
const socket_io_1 = require("socket.io");
let io;
const initSocket = (httpServer) => {
    io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: process.env.FRONTEND_URL,
            methods: ["GET", "POST"],
            credentials: true,
        },
        path: "/socket.io",
        transports: ["websocket", "polling"],
    });
    io.on('connection', (socket) => {
        console.log('User for the auction end connected:', socket.id);
        socket.on('join_auction', (auctionId, userId) => {
            console.log(`User ${userId} in the auction socket joining auction room ${auctionId}`);
            socket.join(auctionId);
        });
        socket.on('disconnect', () => {
            console.log('User disconnected:', socket.id);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getSocketInstance = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
exports.getSocketInstance = getSocketInstance;
