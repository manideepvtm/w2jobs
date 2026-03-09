"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  Briefcase, TrendingUp, BookmarkCheck, MessageSquare,
  Clock, CheckCircle2, XCircle, Eye, ArrowRight,
  AlertCircle, Loader2
} from "lucide-react";

type DashboardData = {
  user: { name: string; email: string; title?: string };
  stats: { totalApplications: number; interviews: number; savedJobs: number };
  recentApplications: {
    id: string; jobTitle: string; company: string;
    location: string; status: string; appliedAt: string;
  }[];
  profileStrength: number;
};

const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  APPLIED:    { label: "Applied",    color: "bg-blue-100 text-blue-700",   icon: Clock },
  REVIEWING:  { label: "Reviewing",  color: "bg-yellow-100 text-yellow-700", icon: Eye },
  INTERVIEW:  { label: "Interview",  color: "bg-purple-100 text-purple-700", icon: MessageSquare },
  OFFER:      { label: "Offer",      color: "bg-green-100 text-green-700",  icon: CheckCircle2 },
  REJECTED:   { label: "Rejected",   color: "bg-red-100 text-red-700",     icon: XCircle },
  WITHDRAWN:  { label: "Withdrawn",  color: "bg-gray-100 text-gray-600",   icon: XCircle },
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user/dashboard")
        .then((r) => r.json())
        .then((d) => { setData(d); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  const firstName = session?.user?.name?.split(" ")[0] ?? "there";
  const stats = [
    { label: "Total Applied", value: data?.stats.totalApplications ?? 0, icon: Briefcase, color: "text-blue-600 bg-blue-50" },
    { label: "Interviews",    value: data?.stats.interviews ?? 0,          icon: MessageSquare, color: "text-purple-600 bg-purple-50" },
    { label: "Saved Jobs",    value: data?.stats.savedJobs ?? 0,           icon: BookmarkCheck, color: "text-green-600 bg-green-50" },
    { label: "Profile Score", value: `${data?.profileStrength ?? 0}%`,     icon: TrendingUp, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Welcome back, {firstName}!
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                {data?.user?.title ?? "Job Seeker"} · {session?.user?.email}
              </p>
            </div>
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
            >
              <Briefcase className="h-4 w-4" />
              Browse Jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="bg-white rounded-xl border border-gray-200 p-5">
                <div className={`inline-flex p-2.5 rounded-xl mb-3 ${color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500 mt-0.5">{label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Applications */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Recent Applications</h2>
                <Link href="/applications" className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
              {!data?.recentApplications.length ? (
                <div className="p-8 text-center">
                  <AlertCircle className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">No applications yet.</p>
                  <Link href="/jobs" className="text-blue-600 text-sm font-medium hover:underline mt-1 inline-block">
                    Browse jobs to apply
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {data.recentApplications.map((app) => {
                    const cfg = statusConfig[app.status] ?? statusConfig.APPLIED;
                    const Icon = cfg.icon;
                    return (
                      <div key={app.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-sm truncate">{app.jobTitle}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{app.company} · {app.location}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${cfg.color}`}>
                            <Icon className="h-3 w-3" />
                            {cfg.label}
                          </span>
                          <span className="text-xs text-gray-400">{timeAgo(app.appliedAt)}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4">
              {/* Profile Strength */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4">Profile Strength</h2>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">
                    {data?.profileStrength ?? 0}% complete
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    (data?.profileStrength ?? 0) >= 80
                      ? "bg-green-100 text-green-700"
                      : (data?.profileStrength ?? 0) >= 50
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}>
                    {(data?.profileStrength ?? 0) >= 80 ? "Strong" : (data?.profileStrength ?? 0) >= 50 ? "Good" : "Weak"}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{ width: `${data?.profileStrength ?? 0}%` }}
                  />
                </div>
                <Link
                  href="/profile"
                  className="block w-full text-center text-sm font-medium text-blue-600 border border-blue-200 rounded-lg py-2 hover:bg-blue-50 transition-colors"
                >
                  Complete Profile
                </Link>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
                <div className="space-y-2">
                  <Link href="/jobs" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                    <Briefcase className="h-4 w-4 text-blue-500" />
                    Browse new jobs
                  </Link>
                  <Link href="/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    Update resume
                  </Link>
                  <Link href="/pricing" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 text-sm text-gray-700 transition-colors">
                    <CheckCircle2 className="h-4 w-4 text-purple-500" />
                    Upgrade plan
                  </Link>
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
