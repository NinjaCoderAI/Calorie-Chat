import axios from 'axios';

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
    }
};

const sendWhatsAppMessage = async (recipientId, message) => {
    const WHATSAPP_API_URL = 'https://graph.facebook.com/v17.0/YOUR_PHONE_NUMBER_ID/messages';
    const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;

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
                    Authorization: `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('WhatsApp message sent:', response.data);
    } catch (error) {
        console.error('Failed to send WhatsApp message:', error.response?.data || error);
    }
};
