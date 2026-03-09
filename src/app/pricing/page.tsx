"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CheckCircle, Crown, Zap, Shield } from "lucide-react";
import { PLANS } from "@/lib/stripe";

const planIcons = {
  free: Shield,
  pro: Zap,
  premium: Crown,
};

const planColors = {
  free: "border-gray-200",
  pro: "border-blue-500 ring-2 ring-blue-500",
  premium: "border-purple-500",
};

const planBadges = {
  free: null,
  pro: "Most Popular",
  premium: "Best Value",
};

export default function PricingPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  async function handleUpgrade(priceId: string | undefined, slug: string) {
    if (slug === "free") return;

    if (!session) {
      router.push("/signup");
      return;
    }

    if (!priceId) {
      alert("Stripe price IDs not configured. Add STRIPE_PRO_PRICE_ID and STRIPE_PREMIUM_PRICE_ID to your environment variables.");
      return;
    }

    setLoading(slug);
    const res = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId }),
    });
    const data = await res.json();
    setLoading(null);

    if (data.url) {
      window.location.href = data.url;
    }
  }

  const plans = [PLANS.FREE, PLANS.PRO, PLANS.PREMIUM];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Header */}
          <div className="text-center mb-14">
            <span className="inline-block bg-blue-100 text-blue-700 text-sm font-semibold px-4 py-1.5 rounded-full mb-4">
              Simple Pricing
            </span>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Invest in Your Career
            </h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Get access to thousands of W2-only jobs. No Corp-to-Corp, no middlemen — just direct W2 opportunities.
            </p>
          </div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan) => {
              const Icon = planIcons[plan.slug as keyof typeof planIcons];
              const badge = planBadges[plan.slug as keyof typeof planBadges];
              const colorClass = planColors[plan.slug as keyof typeof planColors];
              const isPro = plan.slug === "pro";

              return (
                <div
                  key={plan.slug}
                  className={`relative bg-white rounded-2xl border p-8 flex flex-col ${colorClass} ${isPro ? "shadow-xl scale-105" : "shadow-sm"}`}
                >
                  {badge && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <span className={`text-xs font-bold px-4 py-1.5 rounded-full text-white ${isPro ? "bg-blue-600" : "bg-purple-600"}`}>
                        {badge}
                      </span>
                    </div>
                  )}

                  <div className="mb-6">
                    <div className={`inline-flex p-3 rounded-xl mb-4 ${isPro ? "bg-blue-100" : "bg-gray-100"}`}>
                      <Icon className={`h-6 w-6 ${isPro ? "text-blue-600" : "text-gray-600"}`} />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">{plan.name}</h2>
                    <p className="text-gray-500 text-sm mt-1">{plan.description}</p>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500 ml-1">/month</span>
                    </div>
                  </div>

                  <ul className="space-y-3 flex-1 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2.5 text-sm text-gray-700">
                        <CheckCircle className={`h-4 w-4 mt-0.5 flex-shrink-0 ${isPro ? "text-blue-500" : "text-green-500"}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {plan.slug === "free" ? (
                    <button
                      onClick={() => router.push(session ? "/dashboard" : "/signup")}
                      className="w-full py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                    >
                      {session ? "Current Plan" : "Get Started Free"}
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade((plan as { priceId?: string }).priceId, plan.slug)}
                      disabled={loading === plan.slug}
                      className={`w-full py-3 rounded-xl font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${
                        isPro
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "bg-purple-600 text-white hover:bg-purple-700"
                      }`}
                    >
                      {loading === plan.slug
                        ? "Redirecting..."
                        : session
                        ? `Upgrade to ${plan.name}`
                        : `Start ${plan.name} Plan`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="mt-20">
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">
              Frequently Asked Questions
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                {
                  q: "What is a W2 job?",
                  a: "A W2 job means you are hired as a direct employee (not a contractor). The employer withholds taxes and you receive a W2 form at tax time. No Corp-to-Corp allowed.",
                },
                {
                  q: "Can I cancel anytime?",
                  a: "Yes! You can cancel your subscription at any time from your billing portal. You'll retain access until the end of your billing period.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major credit and debit cards through Stripe, including Visa, Mastercard, and American Express.",
                },
                {
                  q: "Is there a free trial?",
                  a: "Yes — the Free plan is free forever with 3 applications per month. Upgrade when you're ready for unlimited access.",
                },
              ].map(({ q, a }) => (
                <div key={q} className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-2">{q}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
