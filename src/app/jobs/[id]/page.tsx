import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { jobs } from "@/data/jobs";
import { formatDate, timeAgo } from "@/lib/utils";
import {
  MapPin,
  DollarSign,
  Clock,
  Users,
  CheckCircle,
  Calendar,
  ArrowLeft,
  Bookmark,
  Share2,
  Building2,
  GraduationCap,
} from "lucide-react";

export async function generateStaticParams() {
  return jobs.map((j) => ({ id: j.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);
  if (!job) return { title: "Job Not Found" };
  return {
    title: `${job.title} at ${job.company} | W2Jobs`,
    description: job.description.slice(0, 160),
  };
}

export default async function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const job = jobs.find((j) => j.id === id);
  if (!job) notFound();

  const logoColors = ["bg-blue-600", "bg-purple-600", "bg-green-600", "bg-orange-600", "bg-red-600", "bg-teal-600"];
  const colorClass = logoColors[parseInt(job.id) % logoColors.length];

  const relatedJobs = jobs.filter((j) => j.category === job.category && j.id !== job.id).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back */}
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 mb-6 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to jobs
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-start gap-4">
                  <div className={`${colorClass} text-white rounded-xl w-16 h-16 flex items-center justify-center font-bold text-lg flex-shrink-0`}>
                    {job.logo}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                        <p className="text-gray-600 font-medium mt-0.5">{job.company}</p>
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
                          <Bookmark className="h-5 w-5" />
                        </button>
                        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-500">
                          <Share2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4" /> {job.salary}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" /> {job.type}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="h-4 w-4" /> {job.applicants} applicants
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.w2Only && (
                        <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-3 py-1 font-medium">
                          <CheckCircle className="h-3.5 w-3.5" /> W2 Only
                        </span>
                      )}
                      <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 rounded-full px-3 py-1 font-medium">
                        {job.category}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                        {job.experience} experience
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 rounded-full px-3 py-1">
                        Posted {timeAgo(job.postedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">About the Role</h2>
                <p className="text-gray-600 leading-relaxed">{job.description}</p>
              </div>

              {/* Requirements */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Requirements
                </h2>
                <ul className="space-y-2">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-600">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Benefits */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                  Benefits & Perks
                </h2>
                <ul className="space-y-2">
                  {job.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center gap-2 text-gray-600">
                      <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {job.skills.map((skill) => (
                    <span key={skill} className="bg-blue-50 text-blue-700 border border-blue-200 text-sm px-3 py-1 rounded-lg">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Apply Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <div className="text-2xl font-bold text-gray-900 mb-1">{job.salary}</div>
                <p className="text-gray-500 text-sm mb-4">per year</p>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors mb-3">
                  Apply Now
                </button>
                <button className="w-full border border-gray-200 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Save Job
                </button>

                <div className="border-t border-gray-100 mt-6 pt-5 space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Building2 className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Company</p>
                      <p className="font-medium text-gray-900">{job.company}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Location</p>
                      <p className="font-medium text-gray-900">{job.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Job Type</p>
                      <p className="font-medium text-gray-900">{job.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-gray-500">Apply By</p>
                      <p className="font-medium text-gray-900">{formatDate(job.deadline)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Related Jobs */}
              {relatedJobs.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Similar Jobs</h3>
                  <div className="space-y-3">
                    {relatedJobs.map((rj) => (
                      <Link key={rj.id} href={`/jobs/${rj.id}`} className="block hover:bg-gray-50 -mx-2 px-2 py-2 rounded-lg transition-colors">
                        <p className="font-medium text-sm text-gray-900 hover:text-blue-600">{rj.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{rj.company} · {rj.location}</p>
                        <p className="text-xs text-blue-600 mt-0.5">{rj.salary}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
