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
class ChatController {
    constructor(_chatUseCase) {
        this._chatUseCase = _chatUseCase;
    }
    // async createChat(req: Request, res: Response) {
    //   try {
    //     const userId = req.body.userId;
    //     const receiverId = req.body.selectedChatId;
    //     const result = await this._chatUseCase.createChat(userId, receiverId);
    //     console.log(result, "this is the result ");
    //     res.status(200).json(result);
    //   } catch (error) {
    //     console.error("Error in chat controller:", error);
    //     res.status(500).json({
    //       success: false,
    //       message: "An error occurred while initializing chat",
    //       error: error instanceof Error ? error.message : String(error)
    //     });
    //   }
    // }
    sendMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { senderId, receiverId, message } = req.body;
            const response = yield this._chatUseCase.sendMessage(senderId, receiverId, message);
            return res.status(200).json(response);
        });
    }
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { senderId, receiverId } = req.params;
                const messages = yield this._chatUseCase.getMessages(senderId, receiverId);
                return res.status(200).json(messages);
            }
            catch (error) {
                console.error("");
            }
        });
    }
    handleChatBotMessage(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, itemDetails } = req.body;
                const response = yield this._chatUseCase.chatBot(message, itemDetails);
                return res.status(200).json({ message: response });
            }
            catch (error) {
                console.error("Error in chatbot message handler:", error);
                res.status(500).json({ message: "Failed to interact with the chatbot." });
            }
        });
    }
}
exports.default = ChatController;
