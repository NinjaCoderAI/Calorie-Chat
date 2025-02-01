import express from 'express';
import { handleIncomingMessage } from '../controllers/messageController.js';
import { createSubscription } from '../controllers/paymentController.js';

const router = express.Router();

router.use(express.json()); // Ensure JSON parsing

// ✅ WhatsApp Webhook Verification (GET request)
router.get('/', (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('✅ Webhook Verified Successfully!');
        return res.status(200).send(challenge);
    } else {
        return res.status(403).send('❌ Verification failed');
    }
});

// ✅ WhatsApp Incoming Messages (POST request)
router.post('/', async (req, res) => {
    try {
        console.log('📩 Received WhatsApp webhook:', JSON.stringify(req.body, null, 2));
        
        // Ensure request contains a valid message
        if (req.body.object && req.body.entry) {
            await handleIncomingMessage(req.body);
            return res.sendStatus(200); // Acknowledge receipt of the message
        } else {
            return res.sendStatus(400);
        }
    } catch (error) {
        console.error('🚨 Error handling incoming message:', error);
        return res.sendStatus(500);
    }
});

export default router; // ✅ Ensure this is the default export
