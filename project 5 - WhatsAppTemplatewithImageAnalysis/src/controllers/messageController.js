
const transcribeAudio = require('../services/transcriptionService');
const paymentService = require('../services/paymentService');
const databaseService = require('../services/databaseService');
const whatsapp = require('../services/whatsappService');
const logger = require('../utils/logger');

const SUBSCRIPTION_MESSAGE = "You're out of blessings ✝ Click here to upgrade and receive unlimited blessings 🙏 https://holywords.ai/subscribe";

async function handleMessage(req, res) {
    const entry = req.body;

    for (const e of entry) {
        for (const change of e.changes) {
            if (change.field === 'messages') {
                if (change.value.messages) {
                    for (const message of change.value.messages) {
                        const from = message.from;
                        const messageType = message.type;

                        try {
                            if (isBlockedCountry(from)) {
                                await whatsapp.sendText(from, BLOCKED_MESSAGE);
                                logger.info(`Blocked message from ${from}`);
                                continue;
                            }

                            let messageContent;
                            if (messageType === 'text') {
                                messageContent = message.text.body;
                            } else if (messageType === 'audio') {
                                const mediaId = message.audio.id;
                                messageContent = await transcribeAudio(mediaId);
                            } else {
                                logger.info(`Unsupported message type: ${messageType}`);
                                continue;
                            }

                            const isSubscribed = await paymentService.checkStripeSubscription(from);
                            const user = await databaseService.findOrCreateUser(from);

                            if (isSubscribed !== user.is_subscribed) {
                                await databaseService.updateSubscription(from, isSubscribed);
                            }

                            const messageCount = await databaseService.incrementMessageCount(from);
                            const contextMessages = await databaseService.getConversationContext(from);

                            let prompt;
                            if (isSubscribed) {
                                prompt = `Previous conversation:\n${contextMessages.map(msg => `${msg.role}: ${msg.content}`).join("\n")}\n\nUser: ${messageContent}\nAssistant:`;
                            } else {
                                await whatsapp.sendText(from, SUBSCRIPTION_MESSAGE);
                                logger.info(`Handled message from ${from}`);
                                continue;
                            }

                            const aiResponse = await generateResponse(prompt);
                            await databaseService.saveMessage(from, messageContent, aiResponse);
                            await whatsapp.sendText(from, aiResponse);

                        } catch (error) {
                            logger.error(`Error handling message from ${from}: ${error.message}`);
                        }
                    }
                }
            }
        }
    }

    res.sendStatus(200);
}

module.exports = { handleMessage };
