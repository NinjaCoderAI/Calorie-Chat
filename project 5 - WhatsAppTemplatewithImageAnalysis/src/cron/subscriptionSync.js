import cron from 'node-cron';
import { TranscriptionService } from '../services/transcriptionService.js';
import { WhatsAppService } from '../services/whatsappService.js';
import { User } from '../models/user.js';
import { supabase } from '../config/supabase.js';

const transcriptionService = new TranscriptionService();
const whatsappService = new WhatsAppService();

// Send messages at different times throughout the day
const schedules = {
  'morning': '0 8 * * *',    // 8 AM
  'afternoon': '0 14 * * *', // 2 PM
  'evening': '0 19 * * *'    // 7 PM
};

export const initializeScheduledMessages = () => {
  Object.entries(schedules).forEach(([timeOfDay, schedule]) => {
    cron.schedule(schedule, async () => {
      try {
        const { data: users } = await supabase
          .from('users')
          .select('*')
          .eq('subscription_status', 'active');

        for (const user of users) {
          const message = await transcriptionService.generateMotivationalMessage('daily-wisdom');
          await whatsappService.sendMessage(user.phone, message);
        }
      } catch (error) {
        console.error(`Error sending scheduled messages for ${timeOfDay}:`, error);
      }
    });
  });
};