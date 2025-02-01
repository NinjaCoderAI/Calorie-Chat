const express = require('express');
const { handleIncomingMessage } = require('../controllers/messageController.js');
const { createSubscription } = require('../controllers/paymentController.js');

const router = express.Router();

router.use(express.json()); // Ensure JSON parsing

// WhatsApp Webhook Verification (GET request)
router.get('/webhooks/whatsapp', (req, res) => {
    const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook Verified Successfully!');
        res.status(200).send(challenge);
    } else {
        res.status(403).send('Verification failed');
    }
});

// WhatsApp Incoming Messages (POST request)
router.post('/webhooks/whatsapp', async (req, res) => {
    try {
        console.log('Received WhatsApp webhook:', JSON.stringify(req.body, null, 2));
        
        // Ensure request contains a valid message
        if (req.body.object && req.body.entry) {
            await handleIncomingMessage(req.body);
            res.sendStatus(200); // Acknowledge receipt of the message
        } else {
            res.sendStatus(400);
        }
    } catch (error) {
        console.error('Error handling incoming message:', error);
        res.sendStatus(500);
    }
});

// Stripe Webhook (for payments)
router.post('/webhooks/stripe', createSubscription);

export default router;
