import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let event: any;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const subscription = await stripe.subscriptions.retrieve(
        session.subscription as string
      ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      const userId = subscription.metadata?.userId;

      if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: {
            stripeSubscriptionId: subscription.id,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items?.data?.[0]?.price?.id,
            stripeCurrentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
          },
        });
      }
      break;
    }

    case "invoice.payment_succeeded": {
      const invoice = event.data.object as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      const subscriptionId = invoice.subscription;
      if (subscriptionId) {
        const subscription = await stripe.subscriptions.retrieve(
          subscriptionId as string
        ) as any; // eslint-disable-line @typescript-eslint/no-explicit-any
        await prisma.user.update({
          where: { stripeSubscriptionId: subscription.id },
          data: {
            stripePriceId: subscription.items?.data?.[0]?.price?.id,
            stripeCurrentPeriodEnd: subscription.current_period_end
              ? new Date(subscription.current_period_end * 1000)
              : null,
          },
        });
      }
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      await prisma.user.update({
        where: { stripeSubscriptionId: subscription.id },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
