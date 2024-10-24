import { Document } from "mongoose";

interface Imessage extends Document {
    message: string;
    senderId: string;
    recipientId: string;
    createdAt: Date;
}

export default Imessage;
