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
const messageModal_1 = __importDefault(require("../../entities_models/messageModal"));
class ChatRepository {
    sendMessage(chat) {
        return __awaiter(this, void 0, void 0, function* () {
            const newMessage = new messageModal_1.default({
                senderId: chat.senderId,
                recipientId: chat.recipientId,
                message: chat.message,
                createdAt: chat.createdAt
            });
            return yield newMessage.save();
        });
    }
    getMessages(sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield messageModal_1.default.find({
                $or: [
                    { senderId: sender, recipientId: receiver },
                    { senderId: receiver, recipientId: sender }
                ]
            }).sort({ createdAt: 1 });
        });
    }
}
exports.default = ChatRepository;
