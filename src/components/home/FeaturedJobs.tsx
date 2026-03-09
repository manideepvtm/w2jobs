import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { jobs } from "@/data/jobs";
import JobCard from "@/components/jobs/JobCard";

export default function FeaturedJobs() {
  const featured = jobs.filter((j) => j.featured).slice(0, 4);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Jobs</h2>
            <p className="text-gray-500 mt-1">Top W2 opportunities from leading companies</p>
          </div>
          <Link
            href="/jobs"
            className="flex items-center gap-1 text-blue-600 font-medium hover:text-blue-700 transition-colors"
          >
            View all jobs
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {featured.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </div>
    </section>
  );
}
