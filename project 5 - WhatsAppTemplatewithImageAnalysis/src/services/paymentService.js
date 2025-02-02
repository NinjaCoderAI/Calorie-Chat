const stripe = require('../config/stripe');

class PaymentService {
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
        // Update user subscription status in the database
        console.log(`Subscription created for phone: ${phone}`);
        break;
      case 'customer.subscription.deleted':
        // Handle subscription cancellation (update DB, notify user, etc.)
        console.log(`Subscription cancelled.`);
        break;
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  }
}

module.exports = new PaymentService();I'm
