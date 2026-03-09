import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
})

export const PLANS = {
  FREE: {
    name: 'Free',
    price: 0,
    features: ['Browse all W2 job listings', 'Save up to 5 jobs', 'Basic profile', 'Email alerts'],
    applicationLimit: 3,
  },
  PRO: {
    name: 'Pro',
    price: 19,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: ['Unlimited applications', 'Resume management', 'Application tracking', 'Priority visibility'],
    applicationLimit: null,
  },
  PREMIUM: {
    name: 'Premium',
    price: 49,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: ['All Pro features', 'Recruiter messaging', '1-on-1 career coaching', 'Featured badge', 'Early job access', 'Priority support'],
    applicationLimit: null,
  },
}

export function getUserPlan(priceId?: string | null) {
  if (!priceId) return 'FREE'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'PRO'
  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return 'PREMIUM'
  return 'FREE'
}
