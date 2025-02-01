import express from 'express';
import dotenv from 'dotenv';
import webhookRoutes from './src/routes/webhookRoutes.js';
import { initializeScheduledMessages } from './src/cron/subscriptionSync.js';

dotenv.config();

const express = require("express");
const app = express();

// Root route to confirm the server is running
app.get("/", (req, res) => {
  res.send("Server is running! 🚀");
});

// Webhook route
app.post("/webhooks/whatsapp", (req, res) => {
  console.log("Received webhook:", req.body);
  res.status(200).send("Webhook received!");
});

// Use Railway-assigned port or default to 8080
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);

});
