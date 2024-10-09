import Stripe from "stripe";
import createClient from '@/supabase/clients/server'


// Respond to a POST request sent to the /api/stripe endpoint by a Stripe webhook
export async function POST(request: Request) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
  
    try {
      const body = await request.text()
      const header = request.headers.get('stripe-signature') || ''
      const secret = process.env.STRIPE_WEBHOOK_SECRET || ''
      const event = stripe.webhooks.constructEvent(body, header, secret)

      // If session is completed, set the Stripe ID in the supabase user_profiles table
      if (event.type === 'checkout.session.completed') {
        const customerId = event.data.object.customer as string
        const clientReferenceId = event.data.object.client_reference_id
        //console.log(`💵 Stripe ID: ${customerId} - Supabase ID: ${clientReferenceId}`)

        if (clientReferenceId && customerId) {
          try {
            await saveStripeId(clientReferenceId, customerId)
          } catch (error) {
            console.error(`🚨 Error setting Stripe ID: ${error}`)
          }
        } else {
          console.error(`🚨 Missing Stripe ID or Supabase ID`)
        }
      }

    } catch (error) {
      return new Response(`Webhook error: ...`, {
        status: 400,
      })
    }
   
    return new Response('Success!', {
      status: 200,
    })
}


async function saveStripeId(userId: string, stripeId: string) {
    const supabase = createClient()
    //const { data, error } = await supabase.from('user_profiles').update({ stripe_id: stripeId }).eq('id', userId)
    // Upsert instead (create row if it doesn't exist)
    const { data, error } = await supabase.from('user_profiles').upsert({ id: userId, stripe_id: stripeId })
    if (error) {
        console.error("error setting stripe id", error)
        throw error
    } else {
        return data
    }
}