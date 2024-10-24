import 'server-only'
import Stripe from "stripe";
import logger from "@/app/_utils/logger";


export async function doesCustomerExist(id: string) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        const _ = await stripe.customers.retrieve(id);
        return true;

    } catch (error) {
        logger.error('next:api', 'doesCustomerExist', (error as Error).message);
        return false;
    }
}


export async function listAllCoupons() {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        const coupons = await stripe.coupons.list();

        logger.log('next:api', 'listAllCoupons:', coupons.data.length, 'found');

        return coupons.data;

    } catch (error) {
        logger.error('next:api', 'listAllCoupons', (error as Error).message);
        return [];
    }
}


export async function listAllCodes() {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        const codes = await stripe.promotionCodes.list();

        logger.log('next:api', 'listAllCodes:', codes.data.length, 'found');

        return codes.data;

    } catch (error) {
        logger.error('next:api', 'listAllCodes', (error as Error).message);
        return [];
    }
}