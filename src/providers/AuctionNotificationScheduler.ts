


import cron from "node-cron";
import NotificationSubscriptionModel from "../entities_models/Notification";
import ProductModel from "../entities_models/productModal";
import { sendAuctionAlert } from "../infrastructure/config/services/fireBaseConfig";
import { whatsAppNotification } from "../infrastructure/config/services/twilioWhatsappNotification";
import NodeMailer from "./nodeMailer";

const scheduledNotifications = new Set();

export const startAuctionCronJob = () => {
  cron.schedule("* * * * *", async () => {
    try {
      const now = new Date();
      const nowISO = now.toISOString();
      const nowUTCMinutes = now.getUTCMinutes();
      const nowUTCHours = now.getUTCHours();

 

      const subscriptions = await NotificationSubscriptionModel.find({});

      for (const subscription of subscriptions) {
        const { _id, fcmToken, auctionId, whatsappNumber, email } = subscription;

        if (scheduledNotifications.has(_id.toString())) {
          console.log(`⏩ Notification for auction ${auctionId} already scheduled. Skipping.`);
          continue;
        }

        const auction = await ProductModel.findById(auctionId);
        console.log(`🔎 Processing auction ID: ${auctionId}`);

        if (!auction) {
          console.warn(`⚠️ Auction ID ${auctionId} not found in database.`);
          continue;
        }

        const auctionStartTime = auction.auctionStartDateTime ? new Date(auction.auctionStartDateTime) : null;

        if (!auctionStartTime || isNaN(auctionStartTime.getTime())) {
          console.error(`🚫 Invalid or missing start time for auction ID ${auctionId}. Skipping.`);
          continue;
        }

        const auctionStartISO = auctionStartTime.toISOString();

        const notificationTime = new Date(auctionStartTime.getTime() - 1 * 60 * 1000);
        console.log(notificationTime,'==============================================================')
        const notificationISO = notificationTime.toISOString();
        const notificationHours = notificationTime.getUTCHours();
        const notificationMinutes = notificationTime.getUTCMinutes();
        
        if (nowUTCHours === notificationHours && nowUTCMinutes === notificationMinutes) {

          const productName = auction.itemTitle || "Unknown Product";
          const productImage = auction.images?.[0] || "";
          const productUrl = `http://localhost:5173/product-details/${auctionId}`;
          const price = auction.reservePrice || '0';

          if (fcmToken) {
            await sendAuctionAlert(fcmToken, `Auction Alert: "${productName}" starts soon!`, productImage, productUrl);
            console.log(`✅ Push notification sent for auction ${auctionId} - Product: ${productName}`);
          } 
          if (whatsappNumber) {
            const productName = auction.itemTitle || "Unknown Product";
            const productImage = auction.images?.[0] || "";
            const productUrl = `${process.env.FRONTEND_URL}/product-details/${auctionId}`;
            console.log(productUrl,'=================================product url.')
            const price = auction.reservePrice || '0';
          
            console.log(`💬 Sending WhatsApp notification to ${whatsappNumber}`);
            await whatsAppNotification(whatsappNumber, productName, price, productUrl, productImage);
            console.log(`✅ WhatsApp message sent to ${whatsappNumber} for auction ${auctionId}`);
          }
          

          if (email) {
            const nodeMailer = new NodeMailer();
            await nodeMailer.sendAuctionStartingSoonEmail(
              email,
              productUrl,
              productName,
              price,
              auctionStartISO,
              productImage
            );
            console.log(`✅ Email sent to ${email} for auction ${auctionId}`);
          }

          scheduledNotifications.add(_id.toString());
        } else {
          console.log(`⏲️ Notification time not yet reached for auction ${auctionId}. Current time (ISO): ${nowISO}`);
        }
      }

      console.log("✅ Cron job execution completed.");
    } catch (error) {
      console.error("❌ Error encountered in cron job for auction notifications:", error);
    }
  });
};

