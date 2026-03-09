"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import JobCard from "@/components/jobs/JobCard";
import JobFilters from "@/components/jobs/JobFilters";
import { jobs } from "@/data/jobs";
import { Suspense } from "react";

function JobsContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedType, setSelectedType] = useState("All Types");
  const [w2Only, setW2Only] = useState(false);
  const [sortBy, setSortBy] = useState("recent");

  const filtered = useMemo(() => {
    let result = [...jobs];

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.skills.some((s) => s.toLowerCase().includes(q)) ||
          j.description.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== "All") {
      result = result.filter((j) => j.category === selectedCategory);
    }
    if (selectedLocation !== "All Locations") {
      result = result.filter((j) => j.location === selectedLocation);
    }
    if (selectedType !== "All Types") {
      result = result.filter((j) => j.type === selectedType);
    }
    if (w2Only) {
      result = result.filter((j) => j.w2Only);
    }

    if (sortBy === "recent") {
      result.sort((a, b) => new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime());
    } else if (sortBy === "salary") {
      result.sort((a, b) => {
        const aVal = parseInt(a.salary.replace(/[^0-9]/g, "").slice(0, 6));
        const bVal = parseInt(b.salary.replace(/[^0-9]/g, "").slice(0, 6));
        return bVal - aVal;
      });
    } else if (sortBy === "applicants") {
      result.sort((a, b) => b.applicants - a.applicants);
    }

    return result;
  }, [searchQuery, selectedCategory, selectedLocation, selectedType, w2Only, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Browse W2 Jobs</h1>
        <p className="text-gray-500 mt-1">Exclusively W2 employment opportunities — no C2C, no 1099</p>
      </div>

      <div className="space-y-4">
        <JobFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          w2Only={w2Only}
          setW2Only={setW2Only}
          totalJobs={filtered.length}
        />

        {/* Sort */}
        <div className="flex justify-end">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="recent">Most Recent</option>
            <option value="salary">Highest Salary</option>
            <option value="applicants">Most Applied</option>
          </select>
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-500">Try adjusting your filters or search terms</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
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
