import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export const whatsAppNotification = async (     
  to: string,
  message: string,
  imageUrl: string
): Promise<void> => {
  try {
    const response = await client.messages.create({
      from: "whatsapp:+14155238886",
      to: `whatsapp:${to}`,
      body: message,
      mediaUrl: [imageUrl]
    });

    console.log(`Message sent: ${response.sid}`);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

