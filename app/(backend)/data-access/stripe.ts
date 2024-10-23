import 'server-only'
import Stripe from "stripe";
import logger from "@/app/_utils/logger";
import { getStripeId, getUser } from './user';



export async function getCustomer(userId?: string) {

    let _userId = userId;

    if (!_userId) {
        const { data: { user: user } } = await getUser();
        if (!user) return null;
        _userId = user.id;
    }

    const { data } = await getStripeId(_userId);
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


export async function customerIsSubscribed(userId?: string) {
    const customer = await getCustomer(userId);

    if (!customer) return false;

    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        // Retrieve subscriptions for the customer
        const subscriptions = await stripe.subscriptions.list({
            customer: customer.id,
            status: 'all', // Fetch all statuses to check if any are active
        });

        logger.log('next:api', 'customerIsSubscribed:', subscriptions);

        // Check if any subscription is active or trialing
        const isSubscribed = subscriptions.data.some(sub =>
            sub.status === 'active' || sub.status === 'trialing'
        );

        return isSubscribed;

    } catch (error) {
        logger.error('next:api', 'customerIsSubscribed', (error as Error).message);
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