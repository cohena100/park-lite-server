const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEB_HOOK_SECRET_KEY;

const create = async (data) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      name: 'Parking',
      description: 'Payment for on street parking',
      amount: 1500,
      currency: 'usd',
      quantity: 1,
    }],
    client_reference_id: JSON.stringify({
      'userId': data.userId,
      'paymentId': data.paymentId,
    }),
    success_url: process.env.STRIPE_SUCCESS_URL,
    cancel_url: process.env.STRIPE_CANCEL_URL,
  });
  return {
    id: session.id,
  };
};

const pay = async (req) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const metadata = JSON.parse(session.client_reference_id);
    return metadata;
  }
  throw new Error();
};

module.exports = {
  create,
  pay,
};