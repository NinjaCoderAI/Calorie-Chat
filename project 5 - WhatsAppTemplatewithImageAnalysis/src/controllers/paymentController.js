const stripe = require('../config/stripe.js').stripe;
const User = require('../models/user.js').User;
const { sendMessage } = require('../services/whatsappService');

const createSubscription = async (req, res) => {
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

    // If you need to send a WhatsApp message, use sendMessage directly
    // await sendMessage(someUrl, someBody);

    res.json({ url: session.url });
  } catch (error) {
    console.error('Subscription error:', error);
    res.status(500).send('Error creating subscription');
  }
};

module.exports = { createSubscription };
