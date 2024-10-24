
import cron from 'node-cron';
import NotificationSubscriptionModel from '../entities_models/Notification';
import ProductModel from '../entities_models/productModal';
import { sendAuctionAlert } from '../infrastructure/config/services/fireBaseConfig';

const scheduledNotifications = new Set();
const CUSTOM_TEST_TIME = '10:30 PM';  
export const startAuctionCronJob = () => {
  cron.schedule('* * * * *', async () => {
    try {
      console.log('Cron job running for scheduled auction notifications...');

      const now = new Date();

      const subscriptions = await NotificationSubscriptionModel.find({});
      console.log(`Found ${subscriptions.length} subscriptions to process.`);

      for (const subscription of subscriptions) {
        const { _id, fcmToken, auctionId } = subscription;

        if (scheduledNotifications.has(_id.toString())) {
          console.log(`Notification for auction ${auctionId} is already scheduled. Skipping...`);
          continue;
        }

        const auction = await ProductModel.findById({ _id: auctionId });
        const auctionStartTimes = auction?.auctionStartDateTime;

        if (!auctionStartTimes) {
          console.error(`Auction with ID ${auctionId} not found. Skipping notification.`);
          continue;
        }

        const auctionStartTime = new Date(auctionStartTimes);

        if (isNaN(auctionStartTime.getTime())) {
          console.error(`Invalid auction start time for auction ${auctionId}. Skipping notification.`);
          continue;
        }

        if (now.getTime() >= auctionStartTime.getTime()) {
          console.log(`Sending notification for auction ${auctionId} immediately.`);

       
          const productName = auction?.itemTitle ?? 'Unknown Product'; 
          const productImage = auction?.images?.[0] ?? ''; 
          const productUrl = `http://localhost:5173/product-details/${auctionId}`;
          console.log(productName,'productName');
          console.log(productImage,'productImage');

          await sendAuctionAlert(fcmToken, `The auction "${productName}" is starting in 20 minutes!`, productImage,productUrl);
          console.log(`Notification sent for auction ${auctionId} - Product: ${productName}`);
          scheduledNotifications.add(_id.toString());
        } else {
          console.warn(`Skipping auction ${auctionId} as the notification time has not yet arrived.`);
        }
      }

      console.log('Cron job completed successfully.');
    } catch (error) {
      console.error('Error in cron job for auction notifications:', error);
    }
  });

  console.log('Cron job scheduled for every minute. Waiting for the specified time to trigger notifications.');
};




// import cron from 'node-cron';
// import NotificationSubscriptionModel from '../entities_models/Notification';
// import ProductModel from '../entities_models/productModal';
// import { sendAuctionAlert } from '../infrastructure/config/fireBaseConfig';

// const scheduledNotifications = new Set();

// export const startAuctionCronJob = () => {
//   cron.schedule('* * * * *', async () => {
//     try {
//       console.log('Cron job running for scheduled auction notifications...');

//       const now = new Date();

//       const subscriptions = await NotificationSubscriptionModel.find({});
//       console.log(`Found ${subscriptions.length} subscriptions to process.`);

//       for (const subscription of subscriptions) {
//         const { _id, fcmToken, auctionId } = subscription;

//         if (scheduledNotifications.has(_id.toString())) {
//           console.log(`Notification for auction ${auctionId} is already scheduled. Skipping...`);
//           continue;
//         }

//         const auction = await ProductModel.findById({ _id: auctionId });
//         const auctionStartTimes = auction?.auctionStartDateTime;
//         console.log(auctionStartTimes,'auctionStartTimes')
//         if (!auctionStartTimes) {
//           console.error(`Auction with ID ${auctionId} not found. Skipping notification.`);
//           continue;
//         }

//         const auctionStartTime = new Date(auctionStartTimes);
//         console.log(auctionStartTime,'auctionStartTimeRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')
//         if (isNaN(auctionStartTime.getTime())) {
//           console.error(`Invalid auction start time for auction ${auctionId}. Skipping notification.`);
//           continue;
//         }

//         // Calculate the time 20 minutes before the auction starts
//         const alertTime = new Date(auctionStartTime.getTime() - 20 * 60 * 1000);
//         console.log(alertTime,'alertTimeRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR')

//         // Check if the current time is within 20 minutes before the auction start time
//         if (now.getTime() >= alertTime.getTime() && now.getTime() < auctionStartTime.getTime()) {
//           console.log(`Sending notification for auction ${auctionId}...`);

//           const productName = auction?.itemTitle ?? 'Unknown Product'; 
//           const productImage = auction?.images?.[0] ?? ''; 
//           const productUrl = `http://localhost:5173/product-details/${auctionId}`;
//           console.log(productName,'productName');
//           console.log(productImage,'productImage');

//           await sendAuctionAlert(fcmToken, `The auction "${productName}" is starting in 20 minutes!`, productImage,productUrl);
//           console.log(`Notification sent for auction ${auctionId} - Product: ${productName}`);

//           scheduledNotifications.add(_id.toString());
//         } else if (now.getTime() >= auctionStartTime.getTime()) {
//           console.warn(`Skipping auction ${auctionId} as it has already started.`);
//         } else {
//           console.warn(`Skipping auction ${auctionId} as it is more than 20 minutes away.`);
//         }
//       }

//       console.log('Cron job completed successfully.');
//     } catch (error) {
//       console.error('Error in cron job for auction notifications:', error);
//     }
//   });

//   console.log('Cron job scheduled for every minute. Waiting for the specified time to trigger notifications.');
// };
