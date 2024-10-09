import Stripe from "stripe";
import logger from "@/app/_utils/logger";


export interface RequestBody {
    number: number;
    params: Stripe.PromotionCodeCreateParams
}

export interface ResponseBody {
    codes: Stripe.PromotionCode[] | null
    error: string | null
}


export async function POST(request: Request) {
    try {
        const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

        const { number, params } = await request.json() as RequestBody

        const codes = await Promise.all(
            Array.from({ length: number }).map(async () => {
                return await stripe.promotionCodes.create(params)
            })
        )

        const response: ResponseBody = { codes, error: null }

        return new Response(JSON.stringify(response), {headers: {'content-type': 'application/json'}})

    } catch (error) {
        logger.error('next:api', 'stripe/create-promotion-codes', error)
        const response: ResponseBody = { codes: null, error: (error as Error).message }

        return new Response(JSON.stringify(response), {status: 500,headers: {'content-type': 'application/json'}})
    }
}