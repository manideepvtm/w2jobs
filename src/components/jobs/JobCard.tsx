import Link from "next/link";
import { MapPin, Clock, DollarSign, Users, Star, CheckCircle } from "lucide-react";
import { Job } from "@/types";
import { timeAgo } from "@/lib/utils";

interface JobCardProps {
  job: Job;
}

const categoryColors: Record<string, string> = {
  Engineering: "bg-blue-100 text-blue-700",
  "Data Science": "bg-purple-100 text-purple-700",
  Product: "bg-green-100 text-green-700",
  Design: "bg-pink-100 text-pink-700",
  Architecture: "bg-orange-100 text-orange-700",
  Security: "bg-red-100 text-red-700",
};

const logoColors = [
  "bg-blue-600",
  "bg-purple-600",
  "bg-green-600",
  "bg-orange-600",
  "bg-red-600",
  "bg-teal-600",
];

export default function JobCard({ job }: JobCardProps) {
  const colorClass = logoColors[parseInt(job.id) % logoColors.length];
  const catColor = categoryColors[job.category] || "bg-gray-100 text-gray-700";

  return (
    <div className={`bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-200 transition-all group ${job.featured ? "ring-1 ring-blue-200" : ""}`}>
      {job.featured && (
        <div className="flex items-center gap-1 text-xs text-amber-600 font-medium mb-2">
          <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
          Featured
        </div>
      )}

      <div className="flex items-start gap-4">
        {/* Logo */}
        <div className={`${colorClass} text-white rounded-xl w-12 h-12 flex items-center justify-center font-bold text-sm flex-shrink-0`}>
          {job.logo}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link href={`/jobs/${job.id}`}>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {job.title}
                </h3>
              </Link>
              <p className="text-gray-600 text-sm mt-0.5">{job.company}</p>
            </div>
            {job.w2Only && (
              <span className="flex items-center gap-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-full px-2 py-0.5 whitespace-nowrap">
                <CheckCircle className="h-3 w-3" />
                W2 Only
              </span>
            )}
          </div>

          <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="flex items-center gap-1">
              <DollarSign className="h-3.5 w-3.5" />
              {job.salary}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {job.type}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mt-3">
            {job.skills.slice(0, 4).map((skill) => (
              <span key={skill} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                {skill}
              </span>
            ))}
            {job.skills.length > 4 && (
              <span className="text-xs text-gray-400 px-2 py-1">+{job.skills.length - 4} more</span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
                {job.category}
              </span>
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {job.applicants} applicants
              </span>
              <span>{timeAgo(job.postedAt)}</span>
            </div>
            <Link
              href={`/jobs/${job.id}`}
              className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
