import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './src/routes/webhookRoutes.js';
import { initializeScheduledMessages } from './src/cron/subscriptionSync.js';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/api', webhookRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  initializeScheduledMessages();
});