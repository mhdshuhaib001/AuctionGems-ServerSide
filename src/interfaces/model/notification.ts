export interface INotificationSubscription extends Document {
    userId: string;
    auctionId: string;
    fcmToken: string;
    whatsappNumber:string;
    email:string;
  }