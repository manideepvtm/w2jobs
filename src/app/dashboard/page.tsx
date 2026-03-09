"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Briefcase,
  CheckCircle,
  Clock,
  TrendingUp,
  Bell,
  ArrowRight,
  Star,
  Crown,
  MapPin,
  AlertCircle,
} from "lucide-react";

const statusColors: Record<string, string> = {
  APPLIED: "bg-blue-100 text-blue-700",
  REVIEWING: "bg-yellow-100 text-yellow-700",
  INTERVIEW: "bg-purple-100 text-purple-700",
  OFFER: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  WITHDRAWN: "bg-gray-100 text-gray-700",
};

const statusLabels: Record<string, string> = {
  APPLIED: "Applied",
  REVIEWING: "Reviewing",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
  WITHDRAWN: "Withdrawn",
};

interface ProfileData {
  user: {
    name: string;
    email: string;
    title?: string;
    skills: string[];
    _count: { applications: number; savedJobs: number };
    applications: Array<{
      id: string;
      status: string;
      appliedAt: string;
      job: { id: string; title: string; company: string; location: string; type: string };
    }>;
  };
  plan: { name: string; slug: string; price: number };
  isSubscribed: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then(setProfile)
        .finally(() => setLoading(false));
    }
  }, [session]);

  async function openBillingPortal() {
    const res = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) return null;

  const apps = profile?.user.applications ?? [];
  const interviews = apps.filter((a) => a.status === "INTERVIEW").length;
  const plan = profile?.plan;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {profile?.user.name?.split(" ")[0] ?? session.user?.name?.split(" ")[0]}! 👋
              </h1>
              <p className="text-gray-500 mt-1">Here&apos;s your job search overview</p>
            </div>
            <Link
              href="/jobs"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
            >
              Browse Jobs
            </Link>
          </div>

          {/* Subscription Banner */}
          {plan && plan.slug === "free" && (
            <div className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Crown className="h-6 w-6 text-yellow-300" />
                <div>
                  <p className="font-semibold">You&apos;re on the Free plan</p>
                  <p className="text-sm text-purple-100">
                    Upgrade to Pro for unlimited applications and advanced features
                  </p>
                </div>
              </div>
              <Link
                href="/pricing"
                className="bg-white text-purple-700 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-50 transition-colors whitespace-nowrap"
              >
                Upgrade Now
              </Link>
            </div>
          )}

          {plan && plan.slug !== "free" && profile?.isSubscribed && (
            <div className="mb-6 bg-green-50 border border-green-200 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 text-green-700">
                <Crown className="h-5 w-5 text-yellow-500" />
                <span className="font-medium">{plan.name} Plan Active</span>
                <span className="text-green-600 text-sm">— Unlimited applications</span>
              </div>
              <button
                onClick={openBillingPortal}
                className="text-sm text-green-700 hover:text-green-800 underline"
              >
                Manage Billing
              </button>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              {
                icon: Briefcase,
                label: "Total Applied",
                value: profile?.user._count.applications ?? 0,
                color: "text-blue-600 bg-blue-100",
              },
              {
                icon: CheckCircle,
                label: "Interviews",
                value: interviews,
                color: "text-green-600 bg-green-100",
              },
              {
                icon: Star,
                label: "Saved Jobs",
                value: profile?.user._count.savedJobs ?? 0,
                color: "text-amber-600 bg-amber-100",
              },
              {
                icon: TrendingUp,
                label: "Active Plan",
                value: plan?.name ?? "Free",
                color: "text-purple-600 bg-purple-100",
              },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className={`inline-flex p-2.5 rounded-lg mb-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Applications */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Recent Applications</h2>
                <Link
                  href="/jobs"
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                  Find more <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {apps.length === 0 ? (
                <div className="p-10 text-center">
                  <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 font-medium">No applications yet</p>
                  <p className="text-gray-400 text-sm mt-1">Start applying to W2 jobs today</p>
                  <Link
                    href="/jobs"
                    className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    Browse Jobs
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {apps.map((app) => (
                    <div
                      key={app.id}
                      className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{app.job.title}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{app.job.company}</p>
                        <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          Applied{" "}
                          {new Date(app.appliedAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[app.status] ?? "bg-gray-100 text-gray-700"}`}
                      >
                        {statusLabels[app.status] ?? app.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Profile Strength</h3>
                {(() => {
                  const u = profile?.user;
                  const checks = [
                    { done: !!u?.name, label: "Name added" },
                    { done: !!u?.title, label: "Job title added" },
                    { done: (u?.skills?.length ?? 0) > 0, label: "Skills added" },
                  ];
                  const done = checks.filter((c) => c.done).length;
                  const pct = Math.round((done / checks.length) * 100);
                  return (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500">{pct}% complete</span>
                        <span className="text-sm font-medium text-blue-600">
                          {pct === 100 ? "Excellent" : pct >= 60 ? "Good" : "Needs work"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <ul className="mt-4 space-y-2">
                        {checks.map(({ done, label }) => (
                          <li key={label} className="flex items-center gap-2 text-sm">
                            <CheckCircle className={`h-4 w-4 ${done ? "text-green-500" : "text-gray-300"}`} />
                            <span className={done ? "text-gray-700" : "text-gray-400"}>{label}</span>
                          </li>
                        ))}
                      </ul>
                    </>
                  );
                })()}
                <Link
                  href="/profile"
                  className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Complete Profile →
                </Link>
              </div>

              {/* Job Alerts */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">New Jobs</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">Fresh W2-only jobs posted today</p>
                <Link
                  href="/jobs"
                  className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg block text-center font-medium transition-colors"
                >
                  View All Jobs
                </Link>
              </div>

              {/* Quick Links */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/jobs" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50">
                    <MapPin className="h-4 w-4" /> Browse Jobs
                  </Link>
                  <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-50">
                    <Briefcase className="h-4 w-4" /> Edit Profile
                  </Link>
                  {plan?.slug === "free" && (
                    <Link href="/pricing" className="flex items-center gap-2 text-sm text-purple-700 hover:text-purple-800 p-2 rounded-lg hover:bg-purple-50">
                      <Crown className="h-4 w-4 text-yellow-500" /> Upgrade to Pro
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
