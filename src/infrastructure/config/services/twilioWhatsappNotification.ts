import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const whatsAppNotification = async (
  to: string,
  productName: string,
  price: string,
  productUrl: string,
  imageUrl: string
): Promise<void> => {

  try {
    const message = `
🛍️ Auction Reminder!
The auction for "${productName}" is starting in 5 minutes!

📅 Starting Price: ${price}
🔗 Product Link: ${productUrl}

Don't miss your chance to bid!
`;

// twilo notification area 

    const response = await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
      to: `whatsapp:+${to}`,
      body: message,
      mediaUrl: [imageUrl]
    });

    console.log(`Message sent: ${response.sid}`);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
