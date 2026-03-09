import { Shield, Zap, Heart, Award, CheckCircle, TrendingUp } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "W2 Verified Jobs",
    description:
      "Every listing is verified to be W2 employment. No hidden C2C or 1099 arrangements.",
    color: "bg-blue-100 text-blue-700",
  },
  {
    icon: Zap,
    title: "AI Job Matching",
    description:
      "Our AI analyzes your profile and matches you with jobs that fit your skills and visa status.",
    color: "bg-purple-100 text-purple-700",
  },
  {
    icon: Heart,
    title: "Full Benefits",
    description:
      "All jobs include health insurance, 401(k), and other W2 employee benefits.",
    color: "bg-red-100 text-red-700",
  },
  {
    icon: Award,
    title: "Top Employers",
    description:
      "Only vetted employers who value long-term W2 relationships and employee growth.",
    color: "bg-amber-100 text-amber-700",
  },
  {
    icon: CheckCircle,
    title: "Visa Friendly",
    description:
      "Filter by visa status. Find employers open to H1B, EAD, GC, and citizens.",
    color: "bg-green-100 text-green-700",
  },
  {
    icon: TrendingUp,
    title: "Career Growth",
    description:
      "Jobs with clear career paths, performance reviews, and promotion opportunities.",
    color: "bg-cyan-100 text-cyan-700",
  },
];

export default function WhyW2Section() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            Why Choose W2Jobs?
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            We built the platform that W2 employees deserve — transparent, secure, and focused on your success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 rounded-xl border border-gray-100 hover:border-blue-200 hover:shadow-sm transition-all">
              <div className={`inline-flex p-3 rounded-xl mb-4 ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
