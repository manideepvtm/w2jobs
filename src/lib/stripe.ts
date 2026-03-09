import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export const PLANS = {
  FREE: {
    name: "Free",
    slug: "free",
    price: 0,
    description: "Get started with W2Jobs",
    applicationLimit: 3,
    features: [
      "Browse all W2 job listings",
      "Save up to 5 jobs",
      "3 applications per month",
      "Basic profile",
      "Email job alerts",
    ],
  },
  PRO: {
    name: "Pro",
    slug: "pro",
    price: 49,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    description: "For active job seekers",
    applicationLimit: -1,
    features: [
      "Everything in Free",
      "Unlimited applications",
      "Unlimited saved jobs",
      "Priority profile visibility",
      "Resume upload & management",
      "Application tracking dashboard",
      "Advanced job filters",
    ],
  },
  PREMIUM: {
    name: "Premium",
    slug: "premium",
    price: 79,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    description: "For power users & professionals",
    applicationLimit: -1,
    features: [
      "Everything in Pro",
      "Featured profile badge",
      "Recruiter direct messages",
      "Salary negotiation insights",
      "1-on-1 career coaching session",
      "Priority customer support",
      "Early access to new jobs",
    ],
  },
};

export type PlanSlug = keyof typeof PLANS;

export function getUserPlan(stripePriceId?: string | null) {
  if (!stripePriceId) return PLANS.FREE;
  if (stripePriceId === process.env.STRIPE_PREMIUM_PRICE_ID) return PLANS.PREMIUM;
  if (stripePriceId === process.env.STRIPE_PRO_PRICE_ID) return PLANS.PRO;
  return PLANS.FREE;
}
