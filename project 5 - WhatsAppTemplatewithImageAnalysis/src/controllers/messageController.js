
```javascript
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Check if required environment variables are set
const WHATSAPP_PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

if (!WHATSAPP_PHONE_NUMBER_ID || !WHATSAPP_ACCESS_TOKEN) {
    console.error('Missing required environment variables. Please check your .env file.');
}

export const handleIncomingMessage = async (body) => {
    try {
        const messageEvent = body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

        if (!messageEvent) {
            console.log('No message received.');
            return;
        }

        const senderId = messageEvent.from;
        const messageText = messageEvent.text?.body || '';

        console.log(`Received message from ${senderId}: ${messageText}`);

        // Define response text
        const responseText = `Hello! You said: "${messageText}"`;

        // Send response back via WhatsApp API
        await sendWhatsAppMessage(senderId, responseText);
    } catch (error) {
        console.error('Error processing WhatsApp message:', error);
        throw error;
    }
};

const sendWhatsAppMessage = async (recipientId, message) => {
    const WHATSAPP_API_URL = `https://graph.facebook.com/v17.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;

    try {
        const response = await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: 'whatsapp',
                recipient_type: 'individual',
                to: recipientId,
                type: 'text',
                text: { body: message }
            },
            {
                headers: {
                    'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('WhatsApp message sent:', response.data);
        return response.data;
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error.response?.data || error);
        throw error;
    }
};

export default {
    handleIncomingMessage
};
```
