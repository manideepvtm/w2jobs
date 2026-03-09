import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";

export default function CTASection() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Ready to Find Your W2 Job?
        </h2>
        <p className="text-blue-200 text-lg mb-8 max-w-xl mx-auto">
          Upload your resume and let our AI find the best W2 positions that match your skills, experience, and work authorization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            <Upload className="h-5 w-5" />
            Upload Resume & Get Matched
          </Link>
          <Link
            href="/jobs"
            className="inline-flex items-center justify-center gap-2 border-2 border-white/50 text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/10 transition-colors"
          >
            Browse All Jobs
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
        <p className="text-blue-300 text-sm mt-6">
          Free for job seekers · No spam · Cancel anytime
        </p>
      </div>
    </section>
  );
}
