"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, CheckCircle, TrendingUp, Users, Briefcase } from "lucide-react";

export default function HeroSection() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/jobs?q=${encodeURIComponent(query)}`);
  };

  return (
    <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-blue-700/50 text-blue-200 border border-blue-600/50 rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <CheckCircle className="h-4 w-4 text-green-400" />
            Exclusively W2 Employment — No Corp-to-Corp
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Find Your Next{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">
              W2 Job
            </span>{" "}
            Today
          </h1>

          <p className="text-blue-200 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            The only job board dedicated to W2 employees. No middlemen, no corp-to-corp.
            Direct hire and W2 contract positions from top companies.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 flex gap-2 shadow-2xl mb-4 max-w-2xl mx-auto">
            <div className="flex-1 flex items-center gap-2 px-3">
              <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or keyword..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 text-gray-900 placeholder-gray-400 outline-none text-base"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
            >
              Search Jobs
            </button>
          </form>

          {/* Popular searches */}
          <div className="flex flex-wrap justify-center gap-2 text-sm text-blue-300">
            <span>Popular:</span>
            {["React Developer", "Data Engineer", "DevOps", "Product Manager", "Python"].map((term) => (
              <button
                key={term}
                onClick={() => router.push(`/jobs?q=${encodeURIComponent(term)}`)}
                className="hover:text-white transition-colors underline underline-offset-2"
              >
                {term}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mt-16">
          {[
            { icon: Briefcase, value: "2,400+", label: "W2 Jobs" },
            { icon: Users, value: "18K+", label: "Job Seekers" },
            { icon: TrendingUp, value: "94%", label: "Placement Rate" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="text-center">
              <div className="flex justify-center mb-2">
                <div className="bg-blue-700/50 rounded-xl p-2.5">
                  <Icon className="h-5 w-5 text-blue-300" />
                </div>
              </div>
              <div className="text-2xl md:text-3xl font-bold text-white">{value}</div>
              <div className="text-blue-300 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
