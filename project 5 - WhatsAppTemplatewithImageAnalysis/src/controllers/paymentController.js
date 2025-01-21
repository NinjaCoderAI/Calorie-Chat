import { stripe } from '../config/stripe.js';
import { User } from '../models/user.js';
import { WhatsAppService } from '../services/whatsappService.js';

const whatsappService = new WhatsAppService();

export const createSubscription = async (req, res) => {
  try {
    const { phone } = req.body;
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Motivational Messages Subscription',
            },
            unit_amount: 500, // $5.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.DOMAIN}/success?phone=${phone}`,
      cancel_url: `${process.env.DOMAIN}/cancel`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).send('Error creating subscription');
  }
};