import Link from "next/link";
import { Briefcase, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Create Account | W2Jobs",
};

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="bg-blue-600 rounded-xl p-2">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              W2<span className="text-blue-600">Jobs</span>
            </span>
          </Link>
          <p className="text-gray-500 mt-2">Join thousands of W2 job seekers</p>
        </div>

        {/* Perks */}
        <div className="bg-blue-600 rounded-2xl p-5 mb-4 text-white">
          <p className="font-semibold mb-3 text-sm">Why create a free account?</p>
          <div className="space-y-2">
            {[
              "AI-powered job matching based on your profile",
              "Apply to W2-only jobs with one click",
              "Track all applications in one dashboard",
              "Get notified when new matching jobs post",
            ].map((perk) => (
              <div key={perk} className="flex items-start gap-2 text-sm text-blue-100">
                <CheckCircle className="h-4 w-4 text-blue-300 mt-0.5 flex-shrink-0" />
                {perk}
              </div>
            ))}
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          <h1 className="text-xl font-bold text-gray-900 mb-6">Create Free Account</h1>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                <input
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                <input
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                placeholder="Min 8 characters"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Work Authorization</label>
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-white text-gray-700">
                <option value="">Select your visa status</option>
                <option value="citizen">US Citizen</option>
                <option value="gc">Green Card (GC)</option>
                <option value="ead">EAD / OPT / CPT</option>
                <option value="h1b">H1B</option>
                <option value="other">Other W2 Authorization</option>
              </select>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
              <input type="checkbox" className="mt-0.5 rounded border-gray-300 text-blue-600" />
              <span>
                I agree to the{" "}
                <Link href="#" className="text-blue-600 hover:underline">Terms of Service</Link>{" "}
                and{" "}
                <Link href="#" className="text-blue-600 hover:underline">Privacy Policy</Link>
              </span>
            </label>

            <Link href="/dashboard">
              <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                Create Free Account
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 font-medium hover:text-blue-700">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
