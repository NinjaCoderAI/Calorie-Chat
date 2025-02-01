const express = require('express');
const { handleIncomingMessage } = require('../controllers/messageController.js');
const { createSubscription } = require('../controllers/paymentController.js');

const router = express.Router();

router.use(express.json()); // Ensure JSON parsing

// WhatsApp Webhook Verification (GET request)
router.get('/webhooks/whatsapp', (req, res) => {
    try {
        const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;
        const mode = req.query['hub.mode'];
        const token = req.query['hub.verify_token'];
        const challenge = req.query['hub.challenge'];

        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook Verified Successfully!');
            return res.status(200).send(challenge);
        } else {
            console.warn('Webhook verification failed');
            return res.status(403).send('Verification failed');
        }
    } catch (error) {
        console.error('Error verifying webhook:', error);
        return res.sendStatus(500);
    }
});

// WhatsApp Incoming Messages (POST request)
router.post('/webhooks/whatsapp', async (req, res) => {
    try {
        console.log('Received WhatsApp webhook:', JSON.stringify(req.body, null, 2));

        if (!req.body || !req.body.object || !req.body.entry) {
            console.warn('Invalid webhook payload received');
            return res.sendStatus(400);
        }

        await handleIncomingMessage(req.body);
        return res.sendStatus(200); // Acknowledge receipt of the message
    } catch (error) {
        console.error('Error handling incoming message:', error);
        return res.sendStatus(500);
    }
});

module.exports = router;
