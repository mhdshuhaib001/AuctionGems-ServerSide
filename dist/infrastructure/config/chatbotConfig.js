"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generationConfig = exports.model = void 0;
const generative_ai_1 = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
exports.model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});
// chatbot api is here this is calculate answers what the chatbot need to send 
exports.generationConfig = {
    temperature: 0.7,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 2048,
};
