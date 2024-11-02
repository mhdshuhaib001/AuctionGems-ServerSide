// import cron from 'node-cron';
// import NotificationSubscriptionModel from '../entities_models/Notification';
// import ProductModel from '../entities_models/productModal';
// import { sendAuctionAlert } from '../infrastructure/config/services/fireBaseConfig';
// import { whatsAppNotification } from '../infrastructure/config/services/twilioWhatsappNotification';
// import NodeMailer from './nodeMailer';

// const scheduledNotifications = new Set();
// const CUSTOM_TEST_TIME = '10:30 PM';
// export const startAuctionCronJob = () => {
//   cron.schedule('* * * * *', async () => {
//     try {
//       console.log('Cron job running for scheduled auction notifications...');

//       const now = new Date();

//       const subscriptions = await NotificationSubscriptionModel.find({});
//       console.log(`Found ${subscriptions.length} subscriptions to process.`);

//       for (const subscription of subscriptions) {
//         const { _id, fcmToken, auctionId,whatsappNumber,email } = subscription;

//         if (scheduledNotifications.has(_id.toString())) {
//           console.log(`Notification for auction ${auctionId} is already scheduled. Skipping...`);
//           continue;
//         }

//         const auction = await ProductModel.findById({ _id: auctionId });
//         const auctionStartTimes = auction?.auctionStartDateTime;

//         if (!auctionStartTimes) {
//           console.error(`Auction with ID ${auctionId} not found. Skipping notification.`);
//           continue;
//         }

//         const auctionStartTime = new Date(auctionStartTimes);

//         if (isNaN(auctionStartTime.getTime())) {
//           console.error(`Invalid auction start time for auction ${auctionId}. Skipping notification.`);
//           continue;
//         }

//         if (now.getTime() >= auctionStartTime.getTime()) {
//           console.log(`Sending notification for auction ${auctionId} immediately.`);

//           const productName = auction?.itemTitle ?? 'Unknown Product';
//           const productImage = auction?.images?.[0] ?? '';
//           const productUrl = `http://localhost:5173/product-details/${auctionId}`;
//           console.log(productName,'productName');
//           console.log(productImage,'productImage');

//           await sendAuctionAlert(fcmToken, `The auction "${productName}" is starting in 20 minutes!`, productImage,productUrl);

//           console.log(`Notification sent for auction ${auctionId} - Product: ${productName}`);

//           if(whatsappNumber){
//             const message = `The auction '${productName}' is starting in 20 minutes! Visit:${productUrl}`
//             await whatsAppNotification(whatsappNumber,message ,productImage);
//             console.log(`Whatsapp Message sent ${whatsappNumber} fro auction ${auctionId}`)
//           }
//           // if (email) {
//           //   const nodeMailer = new NodeMailer();
//           //   const emailSubject = `Auction Starting Soon: ${productName}`;
//           //   const emailBody = `The auction for "${productName}" is starting in 20 minutes! Visit: ${productUrl}`;
//           //   await nodeMailer.sendMail(email, emailSubject, emailBody);
//           //   console.log(`Email sent to ${email} for auction ${auctionId}`);
//           // }
//           scheduledNotifications.add(_id.toString());
//         } else {
//           console.warn(`Skipping auction ${auctionId} as the notification time has not yet arrived.`);
//         }
//       }

//       console.log('Cron job completed successfully.');
//     } catch (error) {
//       console.error('Error in cron job for auction notifications:', error);
//     }
//   });

// };
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
      console.log("Cron job running for scheduled auction notifications...");

      const now = new Date();
      const nowUTCMinutes = now.getUTCMinutes();
      const nowUTCHours = now.getUTCHours();

      const subscriptions = await NotificationSubscriptionModel.find({});
      console.log(`Found ${subscriptions.length} subscriptions to process.`);

      for (const subscription of subscriptions) {
        const { _id, fcmToken, auctionId, whatsappNumber, email } = subscription;

        if (scheduledNotifications.has(_id.toString())) {
          console.log(`Notification for auction ${auctionId} already scheduled. Skipping...`);
          continue;
        }
        const auction = await ProductModel.findById(auctionId);
        const auctionStartTime = auction?.auctionStartDateTime ? new Date(auction.auctionStartDateTime) : null;

        if (!auctionStartTime || isNaN(auctionStartTime.getTime())) {
          console.error(`Invalid or missing start time for auction ${auctionId}. Skipping notification.`);
          continue;
        }

        // Calculate the UTC time 5 minutes before the auction starts
        const notificationTime = new Date(auctionStartTime.getTime() - 5 * 60 * 1000);
        const notificationHours = notificationTime.getUTCHours();
        const notificationMinutes = notificationTime.getUTCMinutes();

        // Check if the current time matches the notification time
        if (nowUTCHours === notificationHours && nowUTCMinutes === notificationMinutes) {
          console.log(`Sending pre-auction notification for auction ${auctionId}`);

          const productName = auction?.itemTitle ?? "Unknown Product";
          const productImage = auction?.images?.[0] ?? "";
          const productUrl = `http://localhost:5173/product-details/${auctionId}`;
          const price = auction?.reservePrice ?? '0';

          // Send Firebase push notification
          if (fcmToken) {
            await sendAuctionAlert(
              fcmToken,
              `Auction Alert: "${productName}" starts soon!`,
              productImage,
              productUrl
            );
            console.log(`Push notification sent for auction ${auctionId} - Product: ${productName}`);
          }

          // Send WhatsApp notification
          if (whatsappNumber) {
            const message = `Reminder: The auction for '${productName}' is starting in 5 minutes! Visit: ${productUrl}`;
            await whatsAppNotification(whatsappNumber, message, productImage);
            console.log(`WhatsApp message sent to ${whatsappNumber} for auction ${auctionId}`);
          }

          // Send email notification
          if (email) {
            const nodeMailer = new NodeMailer();
            await nodeMailer.sendAuctionStartingSoonEmail(
              email,
              productUrl,
              productName,
              price,
              auctionStartTime.toISOString(),
              productImage
            );
            console.log(`Email sent to ${email} for auction ${auctionId}`);
          }

          scheduledNotifications.add(_id.toString());
        } else {
          console.warn(`Skipping auction ${auctionId}, notification time not reached.`);
        }
      }

      console.log("Cron job completed successfully.");
    } catch (error) {
      console.error("Error in cron job for auction notifications:", error);
    }
  });
};
