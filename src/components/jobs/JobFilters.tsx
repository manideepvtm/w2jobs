"use client";

import { Search, MapPin, Filter, X } from "lucide-react";
import { categories, locations } from "@/data/jobs";

interface JobFiltersProps {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
  selectedCategory: string;
  setSelectedCategory: (v: string) => void;
  selectedLocation: string;
  setSelectedLocation: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  w2Only: boolean;
  setW2Only: (v: boolean) => void;
  totalJobs: number;
}

const jobTypes = ["All Types", "Full-time", "Remote", "Contract", "Part-time"];

export default function JobFilters({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  selectedType,
  setSelectedType,
  w2Only,
  setW2Only,
  totalJobs,
}: JobFiltersProps) {
  const hasFilters =
    searchQuery ||
    selectedCategory !== "All" ||
    selectedLocation !== "All Locations" ||
    selectedType !== "All Types" ||
    w2Only;

  const clearAll = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedLocation("All Locations");
    setSelectedType("All Types");
    setW2Only(false);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search job title, skills, or company..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filters Row */}
      <div className="flex flex-wrap gap-3">
        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "All" ? "All Categories" : c}
            </option>
          ))}
        </select>

        {/* Location */}
        <select
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        {/* Job Type */}
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          {jobTypes.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        {/* W2 Only Toggle */}
        <label className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 select-none">
          <input
            type="checkbox"
            checked={w2Only}
            onChange={(e) => setW2Only(e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-sm font-medium text-gray-700">W2 Only</span>
        </label>

        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <X className="h-3.5 w-3.5" />
            Clear all
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        Showing <span className="font-semibold text-gray-900">{totalJobs}</span> jobs
      </p>
    </div>
  );
}
