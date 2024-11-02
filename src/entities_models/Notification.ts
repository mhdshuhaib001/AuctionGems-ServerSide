import mongoose, { Schema, Document } from "mongoose";
import { INotificationSubscription } from "../interfaces/model/notification";


const NotificationSubscriptionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  auctionId: { type: String, required: true },
  fcmToken: { type: String},
  whatsappNumber:{type:String},
  email:{type:String},
});

const NotificationSubscriptionModel = mongoose.model<INotificationSubscription>("NotificationSubscription", NotificationSubscriptionSchema);

export default NotificationSubscriptionModel;
