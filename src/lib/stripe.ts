import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-02-25.clover",
});

export const PLANS = {
  FREE: {
    name: "Free",
    slug: "free",
    price: 0,
    description: "Get started with W2Jobs",
    features: [
      "Browse all W2 job listings",
      "Save up to 5 jobs",
      "3 applications per month",
      "Basic profile",
      "Email job alerts",
    ],
    limits: {
      applicationsPerMonth: 3,
      savedJobs: 5,
    },
  },
  PRO: {
    name: "Pro",
    slug: "pro",
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    description: "For active job seekers",
    features: [
      "Everything in Free",
      "Unlimited applications",
      "Unlimited saved jobs",
      "Priority profile visibility",
      "Resume upload & management",
      "Application tracking dashboard",
      "Advanced job filters",
    ],
    limits: {
      applicationsPerMonth: -1,
      savedJobs: -1,
    },
  },
  PREMIUM: {
    name: "Premium",
    slug: "premium",
    price: 49,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    description: "For power users & professionals",
    features: [
      "Everything in Pro",
      "Featured profile badge",
      "Recruiter direct messages",
      "Salary negotiation insights",
      "1-on-1 career coaching session",
      "Priority customer support",
      "Early access to new jobs",
    ],
    limits: {
      applicationsPerMonth: -1,
      savedJobs: -1,
    },
  },
};

export type PlanSlug = keyof typeof PLANS;

export function getUserPlan(stripePriceId?: string | null) {
  if (!stripePriceId) return PLANS.FREE;
  if (stripePriceId === process.env.STRIPE_PREMIUM_PRICE_ID) return PLANS.PREMIUM;
  if (stripePriceId === process.env.STRIPE_PRO_PRICE_ID) return PLANS.PRO;
  return PLANS.FREE;
}
