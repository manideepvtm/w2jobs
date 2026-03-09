import Stripe from 'stripe'

let _stripe: Stripe | undefined

function getStripeInstance(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
  }
  return _stripe
}

export const stripe = new Proxy({} as Stripe, {
  get(_, prop) {
    const instance = getStripeInstance()
    const value = (instance as any)[prop]
    return typeof value === 'function' ? value.bind(instance) : value
  }
})

export const PLANS = {
  FREE: {
    slug: 'free',
    name: 'Free',
    description: 'Get started with W2 job searching',
    price: 0,
    features: [
      'Browse all W2 job listings',
      'Save up to 5 jobs',
      '3 applications per month',
      'Basic profile',
      'Email alerts',
    ],
    applicationLimit: 3,
  },
  PRO: {
    slug: 'pro',
    name: 'Pro',
    description: 'For serious job seekers',
    price: 49,
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    features: [
      'Unlimited applications',
      'Unlimited saved jobs',
      'Resume management',
      'Application tracking dashboard',
      'Priority profile visibility',
      'Advanced filtering',
    ],
    applicationLimit: null,
  },
  PREMIUM: {
    slug: 'premium',
    name: 'Premium',
    description: 'Maximum career acceleration',
    price: 79,
    priceId: process.env.STRIPE_PREMIUM_PRICE_ID,
    features: [
      'Everything in Pro',
      'Recruiter messaging',
      '1-on-1 career coaching session',
      'Featured profile badge',
      'Early job access',
      'Priority support',
      'Salary negotiation resources',
    ],
    applicationLimit: null,
  },
}

export function getUserPlan(priceId?: string | null) {
  if (!priceId) return 'FREE'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'PRO'
  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return 'PREMIUM'
  return 'FREE'
}
