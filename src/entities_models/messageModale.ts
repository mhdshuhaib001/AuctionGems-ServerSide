import { Schema, model, Document, Types } from "mongoose";

export interface IMessageData extends Document{
    _id:Types.ObjectId
    reciever:Types.ObjectId[]
    sender:Types.ObjectId[]
    content:string;
    chat:Types.ObjectId[]
}

const messageSchema = new Schema<IMessageData>({
    reciever:[{type:Schema.Types.ObjectId,ref:"User"}],
    sender:[{type:Schema.Types.ObjectId,ref:"User"}],
    content:{type:String,trim:true,required:true},
    chat:[{type:Schema.Types.ObjectId,ref:"Chats"}]
},
{timestamps:true}
)

export default model<IMessageData>("Message",messageSchema)