const cron = require('node-cron');
const { WhatsAppService } = require('../services/whatsappService');
const { User } = require('../models/user');
const { supabase } = require('../config/supabase');


// Option to add a simple message generation function
const generateMotivationalMessage = () => {
  // Implement a basic motivational message generator
  const messages = [
    "You've got this! Stay focused on your goals today.",
    "Every small step counts towards your success.",
    "Believe in yourself and your ability to achieve greatness.",
    "Stay motivated and keep pushing forward!"
  ];
  return messages[Math.floor(Math.random() * messages.length)];
};

const initializeScheduledMessages = () => {
  const schedules = {
    'morning': '0 8 * * *',    // 8 AM
    'afternoon': '0 14 * * *', // 2 PM
    'evening': '0 19 * * *'    // 7 PM
  };

  Object.entries(schedules).forEach(([timeOfDay, schedule]) => {
    cron.schedule(schedule, async () => {
      try {
        const { data: users } = await supabase
          .from('users')
          .select('*')
          .eq('subscription_status', 'active');

        for (const user of users) {
          const message = generateMotivationalMessage();
          await whatsappService.sendMessage(user.phone, message);
        }
      } catch (error) {
        console.error(`Error sending scheduled messages for ${timeOfDay}:`, error);
      }
    });
  });
};

module.exports = { initializeScheduledMessages };
