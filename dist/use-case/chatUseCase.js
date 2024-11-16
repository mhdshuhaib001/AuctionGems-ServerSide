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
Object.defineProperty(exports, "__esModule", { value: true });
const chatbotConfig_1 = require("../infrastructure/config/chatbotConfig");
const chatSession = chatbotConfig_1.model.startChat({
    generationConfig: chatbotConfig_1.generationConfig,
    history: [],
});
class ChatUseCase {
    constructor(_chatRepository, _sellerRepository) {
        this._chatRepository = _chatRepository;
        this._sellerRepository = _sellerRepository;
    }
    sendMessage(sender, receiver, message) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Sending message...");
            const chat = {
                senderId: sender,
                recipientId: receiver,
                message: message,
                createdAt: new Date()
            };
            yield this._chatRepository.sendMessage(chat);
            console.log("Message sent successfully.");
        });
    }
    getMessages(sender, receiver) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("Fetching messages...");
            const messages = yield this._chatRepository.getMessages(sender, receiver);
            console.log("Messages retrieved successfully.");
            return messages;
        });
    }
    chatBot(message, itemDetails) {
        return __awaiter(this, void 0, void 0, function* () {
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
                const result = yield chatSession.sendMessage(`${context}\n\nHuman: ${message}`);
                const response = yield result.response.text();
                return response;
            }
            catch (error) {
                console.error("Error in chatBot function:", error);
                throw new Error("Failed to interact with the chatbot.");
            }
        });
    }
}
exports.default = ChatUseCase;
