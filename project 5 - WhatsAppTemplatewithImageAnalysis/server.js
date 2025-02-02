const express = require('express');
const dotenv = require('dotenv');
const webhookRoutes = require('./src/routes/webhookRoutes');
const { initializeScheduledMessages } = require('./src/cron/subscriptionSync');

dotenv.config();

const app = express();

// Middleware to parse JSON requests (needed for webhooks)
app.use(express.json());

// Root route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

// WhatsApp Webhook Verification
app.get("/webhooks/whatsapp", (req, res) => {
  const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("Webhook Verified!");
    res.status(200).send(challenge);
  } else {
    res.status(403).send("Verification failed");
  }
});

// Use webhook routes for POST requests
app.use("/webhooks/whatsapp", webhookRoutes);

// Start scheduled tasks
initializeScheduledMessages();

// Use Railway-assigned port or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
