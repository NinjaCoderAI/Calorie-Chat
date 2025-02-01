import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './src/routes/webhookRoutes.js';
import { initializeScheduledMessages } from './src/cron/subscriptionSync.js';

dotenv.config();

const app = express();

// Middleware to parse JSON requests (needed for webhooks)
app.use(express.json());

// Root route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

// Use webhook routes
app.use("/webhooks/whatsapp", webhookRoutes);

// Start scheduled tasks
initializeScheduledMessages();

// Use Railway-assigned port or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


