import Stripe from "stripe";
import logger from "@/app/_utils/logger";


export async function doesCustomerExist(id: string) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    try {
        const response = await stripe.customers.retrieve(id);
        return true;

    } catch (error) {
        //logger.error('next:api', 'doesCustomerExist', error.message);
        return false;
    }
}


export async function listAllCoupons() {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    try {
        const coupons = await stripe.coupons.list();
        return coupons.data;

    } catch (error) {
        logger.error('next:api', 'listAllCoupons', (error as Error).message);
        return [];
    }
}