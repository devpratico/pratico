'use server'
import Stripe from "stripe";


const getStripeClient = async () => {
    return new Stripe(process.env.STRIPE_SECRET_KEY!);
};


export async function doesCustomerExist(id: string): Promise<boolean>{
  const stripe = await getStripeClient();
  try {
      const response = await stripe.customers.retrieve(id);
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