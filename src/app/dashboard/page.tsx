import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import {
  Briefcase,
  Eye,
  CheckCircle,
  Clock,
  TrendingUp,
  Bell,
  FileText,
  ArrowRight,
  Star,
  MapPin,
} from "lucide-react";

const applications = [
  { id: "1", title: "Senior Software Engineer", company: "TechCorp Solutions", appliedAt: "2026-03-01", status: "Interview" },
  { id: "2", title: "Data Scientist", company: "Analytics AI", appliedAt: "2026-03-03", status: "Reviewing" },
  { id: "3", title: "Full Stack Developer", company: "StartupX", appliedAt: "2026-03-05", status: "Applied" },
  { id: "4", title: "Cloud Architect", company: "NexGen Systems", appliedAt: "2026-02-28", status: "Rejected" },
];

const statusColors: Record<string, string> = {
  Applied: "bg-blue-100 text-blue-700",
  Reviewing: "bg-yellow-100 text-yellow-700",
  Interview: "bg-purple-100 text-purple-700",
  Offer: "bg-green-100 text-green-700",
  Rejected: "bg-red-100 text-red-700",
};

const recommendedJobs = [
  { id: "1", title: "Senior Software Engineer", company: "TechCorp Solutions", salary: "$130k-$160k", match: 95, location: "Austin, TX" },
  { id: "7", title: "Cloud Architect", company: "NexGen Systems", salary: "$160k-$200k", match: 88, location: "Dallas, TX" },
  { id: "3", title: "DevOps Engineer", company: "CloudBase Inc", salary: "$120k-$150k", match: 82, location: "Seattle, WA" },
];

export default function DashboardPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Manideep! 👋</h1>
              <p className="text-gray-500 mt-1">Here&apos;s your job search overview</p>
            </div>
            <Link href="/jobs" className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm">
              Browse Jobs
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Briefcase, label: "Total Applied", value: "12", color: "text-blue-600 bg-blue-100" },
              { icon: Eye, label: "Profile Views", value: "48", color: "text-purple-600 bg-purple-100" },
              { icon: CheckCircle, label: "Interviews", value: "3", color: "text-green-600 bg-green-100" },
              { icon: Star, label: "Saved Jobs", value: "7", color: "text-amber-600 bg-amber-100" },
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
                <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                  View all <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="divide-y divide-gray-100">
                {applications.map((app) => (
                  <div key={app.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{app.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{app.company}</p>
                      <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Applied {new Date(app.appliedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      </p>
                    </div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[app.status]}`}>
                      {app.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Profile Completion */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Profile Strength</h3>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-500">72% complete</span>
                  <span className="text-sm font-medium text-blue-600">Good</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: "72%" }} />
                </div>
                <ul className="mt-4 space-y-2">
                  {[
                    { done: true, label: "Basic info added" },
                    { done: true, label: "Resume uploaded" },
                    { done: false, label: "Add work experience" },
                    { done: false, label: "Add skills" },
                  ].map(({ done, label }) => (
                    <li key={label} className="flex items-center gap-2 text-sm">
                      <CheckCircle className={`h-4 w-4 ${done ? "text-green-500" : "text-gray-300"}`} />
                      <span className={done ? "text-gray-700" : "text-gray-400"}>{label}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/profile" className="mt-4 block text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Complete Profile →
                </Link>
              </div>

              {/* Alerts */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bell className="h-4 w-4 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Job Alerts</h3>
                </div>
                <p className="text-sm text-gray-500 mb-3">You have 3 new jobs matching your profile</p>
                <Link href="/jobs" className="text-sm bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-2 rounded-lg block text-center font-medium transition-colors">
                  View New Matches
                </Link>
              </div>
            </div>
          </div>

          {/* AI Recommendations */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <h2 className="font-semibold text-gray-900">AI Job Recommendations</h2>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full font-medium">Powered by AI</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-100">
              {recommendedJobs.map((job) => (
                <Link key={job.id} href={`/jobs/${job.id}`} className="p-5 hover:bg-gray-50 transition-colors block">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full">
                      {job.match}% Match
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 text-sm">{job.title}</h3>
                  <p className="text-gray-500 text-xs mt-0.5">{job.company}</p>
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                    <span>·</span>
                    <span className="text-green-600 font-medium">{job.salary}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
