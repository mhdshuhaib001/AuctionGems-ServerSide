import { Schema, model } from "mongoose";
import Imessage from "../interfaces/model/Imessage";

const messageSchema = new Schema<Imessage>({
    message: {
        type: String,
        required: true
    },
    senderId: {
        type: String,
   
        required: true
    },
    recipientId: {
        type: String,
      
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

const Message = model<Imessage>("Message", messageSchema);

export default Message;

