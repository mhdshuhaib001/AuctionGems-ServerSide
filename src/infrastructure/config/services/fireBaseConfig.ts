import admin from 'firebase-admin';
import serviceAccount from '../services/serviceAccountKey.json';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

export default admin;
export const messaging = admin.messaging();


export const sendAuctionAlert = async (fcmToken: string, auctionTitle: string, auctionImage: string,productUrl:string) => {
  console.log(fcmToken, "fcmToken===============================================");

  const message = `The auction "${auctionTitle}" is starting in 20 minutes!`;
  const payload = {
    notification: {
      title: "Auction Starting Soon!",
      body: message,
    },
    data: {
      auctionTitle: auctionTitle,  
      auctionImage: auctionImage,   
      icon: auctionImage,             
      productUrl:productUrl,
    },
    token: fcmToken,
  };

  console.log(payload, 'payload');
  
  try {
    const response = await admin.messaging().send(payload);
    console.log('Successfully sent notification:', response);
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};
