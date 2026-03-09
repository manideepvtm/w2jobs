import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { supabaseAdmin } from '@/lib/supabase'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      const customerId = session.customer as string
      const subscriptionId = session.subscription as string

      const subscription = await stripe.subscriptions.retrieve(subscriptionId)

      await supabaseAdmin
        .from('profiles')
        .update({
          stripe_customer_id: customerId,
          subscription_id: subscriptionId,
          subscription_status: 'active',
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        })
        .eq('stripe_customer_id', subscription.customer as string)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      await supabaseAdmin
        .from('profiles')
        .update({
          subscription_status: 'canceled',
          subscription_id: null,
          current_period_end: null,
        })
        .eq('stripe_customer_id', subscription.customer as string)
      break
    }
  }

  return NextResponse.json({ received: true })
}
