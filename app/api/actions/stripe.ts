'use server'
import Stripe from "stripe";
import { cache } from "react";
//import logger from "@/app/_utils/logger";


const getStripeClient = async () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY!);
};


export const doesCustomerExist = cache(async (id: string) => {
  const stripe = await getStripeClient();
  try {
      const response = await stripe.customers.retrieve(id);
      return true;
  } catch (error) {
        //logger.error('next:api', 'doesCustomerExist', error.message);
    return false;
  }
})

/*
export async function getCustomerByEmail(email: string) {
  return await getStripeClient().customers.list({ email });
}
*/