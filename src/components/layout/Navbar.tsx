"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Briefcase, Bell, User } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-blue-600 rounded-lg p-1.5">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              W2<span className="text-blue-600">Jobs</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Find Jobs
            </Link>
            <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Dashboard
            </Link>
            <Link href="/profile" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              My Profile
            </Link>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button className="relative p-2 text-gray-500 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </button>
            <Link href="/login" className="text-gray-600 hover:text-blue-600 font-medium transition-colors">
              Sign In
            </Link>
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-2">
            <Link href="/jobs" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              Find Jobs
            </Link>
            <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              Dashboard
            </Link>
            <Link href="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
              My Profile
            </Link>
            <div className="pt-2 border-t border-gray-100 flex gap-2 px-4">
              <Link href="/login" className="flex-1 text-center py-2 border border-gray-300 rounded-lg text-gray-700 font-medium">
                Sign In
              </Link>
              <Link href="/signup" className="flex-1 text-center py-2 bg-blue-600 text-white rounded-lg font-medium">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
