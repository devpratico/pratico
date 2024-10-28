import 'server-only'
import Stripe from "stripe";
import logger from "@/app/_utils/logger";
import { fetchUser, fetchStripeId } from '../user/user.server';
import config from './stripe.config';



export async function getCustomer(userId?: string) {

    let _userId = userId;

    if (!_userId) {
        const { user } = await fetchUser();
        if (!user) return null;
        _userId = user.id;
    }

    const { data } = await fetchStripeId(_userId);
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

    const productId = config.productsIds.pratico_v2[process.env.NODE_ENV!];

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
            // Check if the subscription is active or trialing
            (sub.status === 'active' || sub.status === 'trialing')
            &&
            // Check if the subscription contains the product (pratico_v2)
            (sub.items.data.some(item => item.price.product === productId))
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
        const codes = await stripe.promotionCodes.list({limit: 100});

        logger.log('next:api', 'listAllCodes:', codes.data.length, 'found');

        return codes.data;

    } catch (error) {
        logger.error('next:api', 'listAllCodes', (error as Error).message);
        return [];
    }
}