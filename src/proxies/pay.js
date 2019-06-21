const sk = process.env.STRIPE_SECRET_KEY;
const stripe = require('stripe')(sk);

const create = async (data) => {
  console.log(JSON.stringify(data));
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      name: 'T-shirt',
      description: 'Comfortable cotton t-shirt',
      amount: data.amount,
      currency: 'usd',
      quantity: 1,
      metadata: {
        'userId': data.userId,
        'paymentId': data.paymentId,
      },
    }],
    success_url: 'https://stormy-dusk-75310.herokuapp.com/payments/success',
    cancel_url: 'https://stormy-dusk-75310.herokuapp.com/payments/cancel',
  });
  console.log(JSON.stringify(session));
  return {
    id: session.id,
  };
};

module.exports = {
  create,
};