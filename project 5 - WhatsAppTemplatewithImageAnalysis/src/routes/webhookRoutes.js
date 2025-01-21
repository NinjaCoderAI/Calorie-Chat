import express from 'express';
import { handleIncomingMessage } from '../controllers/messageController.js';
import { createSubscription } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/webhook/whatsapp', handleIncomingMessage);
router.post('/webhook/stripe', createSubscription);

export default router;