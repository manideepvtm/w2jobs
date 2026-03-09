"use client";

import { useState, useEffect, useMemo, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, MapPin, Briefcase, DollarSign, Bookmark, Clock, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary?: string;
  remote: boolean;
  featured: boolean;
  postedAt: string;
  _count: { applications: number };
}

function JobsContent() {
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const router = useRouter();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [type, setType] = useState("");
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [applying, setApplying] = useState<string | null>(null);
  const [saving, setSaving] = useState<string | null>(null);
  const [savedJobs, setSavedJobs] = useState<Set<string>>(new Set());
  const [applyModal, setApplyModal] = useState<Job | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  }

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type) params.set("type", type);
    if (remoteOnly) params.set("remote", "true");

    const res = await fetch(`/api/jobs?${params}`);
    const data = await res.json();
    setJobs(data.jobs ?? []);
    setLoading(false);
  }

  const filtered = useMemo(() => {
    let result = [...jobs];
    if (type) result = result.filter((j) => j.type === type);
    if (remoteOnly) result = result.filter((j) => j.remote);
    return result;
  }, [jobs, type, remoteOnly]);

  async function handleApply() {
    if (!session) { router.push("/login"); return; }
    if (!applyModal) return;
    setApplying(applyModal.id);
    const res = await fetch(`/api/jobs/${applyModal.id}/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coverLetter }),
    });
    const data = await res.json();
    setApplying(null);
    setApplyModal(null);
    setCoverLetter("");
    if (res.ok) {
      showToast(`Applied to ${applyModal.title} at ${applyModal.company}!`);
    } else if (data.upgradeRequired) {
      router.push("/pricing");
    } else {
      showToast(data.error || "Failed to apply", "error");
    }
  }

  async function handleSave(job: Job) {
    if (!session) { router.push("/login"); return; }
    setSaving(job.id);
    const res = await fetch(`/api/jobs/${job.id}/save`, { method: "POST" });
    const data = await res.json();
    setSaving(null);
    if (res.ok) {
      const newSaved = new Set(savedJobs);
      if (data.saved) {
        newSaved.add(job.id);
        showToast("Job saved!");
      } else {
        newSaved.delete(job.id);
        showToast("Job removed from saved");
      }
      setSavedJobs(newSaved);
    }
  }

  function timeSince(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const days = Math.floor(diff / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "1 day ago";
    return `${days} days ago`;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl shadow-lg text-white text-sm font-medium ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* Apply Modal */}
      {applyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-2xl">
            <h2 className="text-lg font-bold text-gray-900 mb-1">Apply to {applyModal.title}</h2>
            <p className="text-gray-500 text-sm mb-4">{applyModal.company} · {applyModal.location}</p>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Cover Letter <span className="text-gray-400">(optional)</span>
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={5}
              placeholder="Tell the employer why you're a great fit..."
              className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => { setApplyModal(null); setCoverLetter(""); }}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-700 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApply}
                disabled={applying === applyModal.id}
                className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 disabled:opacity-60"
              >
                {applying === applyModal.id ? "Submitting..." : "Submit Application"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse W2 Jobs</h1>
        <p className="text-gray-500 mt-1">Exclusively W2 employment — no C2C, no 1099</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
              placeholder="Search jobs, companies, skills..."
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
          </select>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer px-3 py-2.5 border border-gray-200 rounded-xl hover:bg-gray-50">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="rounded border-gray-300 text-blue-600"
            />
            Remote Only
          </label>
          <button
            onClick={fetchJobs}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {loading ? "Loading..." : `${filtered.length} jobs found`}
      </p>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
              <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="text-5xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map((job) => (
            <div key={job.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow flex flex-col">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    {job.featured && (
                      <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">Featured</span>
                    )}
                    {job.remote && (
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Remote</span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5">{job.company}</p>
                </div>
                <button
                  onClick={() => handleSave(job)}
                  disabled={saving === job.id}
                  className={`p-2 rounded-lg transition-colors ml-2 ${savedJobs.has(job.id) ? "text-blue-600 bg-blue-50" : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"}`}
                >
                  <Bookmark className="h-4 w-4" fill={savedJobs.has(job.id) ? "currentColor" : "none"} />
                </button>
              </div>

              <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" /> {job.location}
                </span>
                <span className="flex items-center gap-1">
                  <Briefcase className="h-3.5 w-3.5" /> {job.type}
                </span>
                {job.salary && (
                  <span className="flex items-center gap-1 text-green-600 font-medium">
                    <DollarSign className="h-3.5 w-3.5" /> {job.salary}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {timeSince(job.postedAt)}
                </span>
              </div>

              <div className="mt-auto flex gap-2">
                <button
                  onClick={() => setApplyModal(job)}
                  className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  Apply Now
                </button>
                <Link
                  href={`/jobs/${job.id}`}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading jobs...</div>}>
          <JobsContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
