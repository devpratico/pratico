import 'server-only'
import Stripe from "stripe";
import logger from "@/app/_utils/logger";
import { getStripeId, getUser } from './user';



export async function getCustomer() {

    const { data: { user: user } } = await getUser();
    if (!user) return null;

    const { data } = await getStripeId(user.id);
    if (!data?.stripe_id) return null;

    const stripeId = data.stripe_id;

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
        const customer = await stripe.customers.retrieve(stripeId);
        logger.log('next:api', 'getCustomer:', customer.id);
        return customer;

    } catch (error) {
        logger.error('next:api', 'doesCustomerExist', (error as Error).message);
        return null
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