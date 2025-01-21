const { OpenAI } = require('openai'); // Updated import for OpenAI SDK
const logger = require('../utils/logger');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const SYSTEM_PROMPT = 'YOUR-PROMPT-GOES-HERE';

const GREETING_RESPONSES = [
  "Hi there! How can I help you today? 🙏",
  // ... other greeting responses ...
];

async function generateResponse(message) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4a-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message }
      ],
      temperature: 0.2,
      max_tokens: 1500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    logger.error(`Error generating response: ${error.message}`);
    throw error;
  }
}

function isGreeting(message) {
  const greetings = ['hi', 'hello', 'hey', 'greetings'];
  return greetings.some(greeting => message.toLowerCase().includes(greeting));
}

module.exports = { generateResponse };