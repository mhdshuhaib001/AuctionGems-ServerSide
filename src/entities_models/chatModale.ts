import mongoose, { Schema, Types, model } from "mongoose";


interface IChatData {
    _id: Types.ObjectId;
    chatName: string;
    receiverId: Types.ObjectId;
    userId: Types.ObjectId;
    latestMessage: Types.ObjectId[]; 
    createdAt?: Date;
    updatedAt?: Date;
}
const chatModel = new Schema<IChatData>({
    chatName: { type: String, required: true },
    receiverId: { type: Schema.Types.ObjectId },
    userId: { type: Schema.Types.ObjectId },
    latestMessage: [{ type: Schema.Types.ObjectId, ref: 'Message' }]
}, {
    timestamps: true
});

export const ChatModel = model<IChatData>('Chat', chatModel);