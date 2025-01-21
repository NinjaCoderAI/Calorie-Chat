import { stripe } from '../config/stripe.js';

export class PaymentService {
  async createSubscription(phone, priceId) {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: priceId,
          quantity: 1,
        }],
        mode: 'subscription',
        success_url: `${process.env.DOMAIN}/success?phone=${phone}`,
        cancel_url: `${process.env.DOMAIN}/cancel`,
        metadata: { phone },
      });
      return session;
    } catch (error) {
      console.error('Payment error:', error);
      throw error;
    }
  }

  async handleWebhook(event) {
    switch (event.type) {
      case 'checkout.session.completed':
        const { phone } = event.data.object.metadata;
        // Update user subscription status
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation
        break;
    }
  }
}