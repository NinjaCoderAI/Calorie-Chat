import { WhatsAppService } from '../services/whatsappService.js';
import { TranscriptionService } from '../services/transcriptionService.js';
import { User } from '../models/user.js';

const whatsappService = new WhatsAppService();
const transcriptionService = new TranscriptionService();

export const handleIncomingMessage = async (req, res) => {
  try {
    const { from, body } = req.body;
    const user = await User.getByPhone(from);

    if (!user) {
      await User.create(from);
      await whatsappService.sendMessage(from, 'Welcome! Subscribe to receive daily motivational messages.');
      return res.status(200).send('Welcome message sent');
    }

    if (user.subscription_status !== 'active') {
      await whatsappService.sendMessage(from, 'Please subscribe to receive motivational messages.');
      return res.status(200).send('Subscription prompt sent');
    }

    const message = await transcriptionService.generateMotivationalMessage('daily-wisdom');
    await whatsappService.sendMessage(from, message);
    
    res.status(200).send('Message processed');
  } catch (error) {
    console.error('Message handling error:', error);
    res.status(500).send('Error processing message');
  }
};