'use server'
import Stripe from "stripe";
import getStripeClient from "../getStripeClient";


export async function doesCustomerExist(id: string): Promise<boolean>{
  const stripe = await getStripeClient();
  try {
     const customer = stripe.customers.retrieve(id);
      return true;
  } catch (error) {
    if (error instanceof Stripe.errors.StripeError) {
      //console.error(error.message);
    }
    return false;
  }
}

/*
export async function getCustomerByEmail(email: string) {
  return await getStripeClient().customers.list({ email });
}
*/