'use server'
import stripe from 'stripe';

const getStripeClient = () => {
  return new stripe(process.env.STRIPE_SECRET_KEY!);
};

export default getStripeClient;
