export interface INotificationSubscription extends Document {
    userId: string;
    auctionId: string;
    fcmToken: string;
    notifyAt: Date;
  }