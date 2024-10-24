import mongoose, { Schema, Document } from "mongoose";
import { INotificationSubscription } from "../interfaces/model/notification";


// Define the schema for FCM token storage
const NotificationSubscriptionSchema: Schema = new Schema({
  userId: { type: String, required: true },
  auctionId: { type: String, required: true },
  fcmToken: { type: String, required: true },
  notifyAt: { type: Date, default: Date.now },
});

const NotificationSubscriptionModel = mongoose.model<INotificationSubscription>("NotificationSubscription", NotificationSubscriptionSchema);

export default NotificationSubscriptionModel;
