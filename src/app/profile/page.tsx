"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  Plus,
  Edit3,
  CheckCircle,
  Award,
  X,
  Save,
  Crown,
} from "lucide-react";
import Link from "next/link";

interface UserProfile {
  name: string;
  email: string;
  title?: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills: string[];
  linkedinUrl?: string;
  githubUrl?: string;
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [plan, setPlan] = useState<{ name: string; slug: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");

  // Form state
  const [form, setForm] = useState({
    name: "",
    title: "",
    bio: "",
    location: "",
    phone: "",
    linkedinUrl: "",
    githubUrl: "",
  });
  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((data) => {
          setProfile(data.user);
          setPlan(data.plan);
          setForm({
            name: data.user.name ?? "",
            title: data.user.title ?? "",
            bio: data.user.bio ?? "",
            location: data.user.location ?? "",
            phone: data.user.phone ?? "",
            linkedinUrl: data.user.linkedinUrl ?? "",
            githubUrl: data.user.githubUrl ?? "",
          });
          setSkills(data.user.skills ?? []);
        })
        .finally(() => setLoading(false));
    }
  }, [session]);

  async function handleSave() {
    setSaving(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, skills }),
    });
    const data = await res.json();
    setSaving(false);
    if (res.ok) {
      setProfile(data.user);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  }

  function addSkill() {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!session) return null;

  const completion = [
    !!profile?.name,
    !!profile?.title,
    !!profile?.bio,
    !!profile?.location,
    (profile?.skills?.length ?? 0) > 0,
  ];
  const pct = Math.round((completion.filter(Boolean).length / completion.length) * 100);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            {saved && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium bg-green-50 px-3 py-1.5 rounded-lg border border-green-200">
                <CheckCircle className="h-4 w-4" /> Saved successfully
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {(profile?.name ?? session.user?.name ?? "U")[0].toUpperCase()}
                </div>
                <h2 className="font-bold text-gray-900 text-lg">{profile?.name}</h2>
                {profile?.title && <p className="text-blue-600 text-sm font-medium">{profile.title}</p>}
                {profile?.location && (
                  <p className="text-gray-500 text-xs mt-1 flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {profile.location}
                  </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Profile complete</span>
                    <span className="text-xs font-semibold text-blue-600">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate text-xs">{profile?.email ?? session.user?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-xs">{profile.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Subscription */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Crown className="h-4 w-4 text-yellow-500" />
                  Subscription
                </h3>
                <div className="text-sm text-gray-700">
                  <span className="font-medium">{plan?.name ?? "Free"} Plan</span>
                </div>
                {plan?.slug === "free" && (
                  <Link
                    href="/pricing"
                    className="mt-3 block text-center text-sm bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Upgrade to Pro
                  </Link>
                )}
              </div>

              {/* W2 Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  W2 Status
                </h3>
                <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                  ✓ Eligible for W2 employment
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-600" />
                    Basic Information
                  </h2>
                  {editing ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditing(false)}
                        className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 border border-gray-200 rounded-lg"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        disabled={saving}
                        className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 flex items-center gap-1 disabled:opacity-60"
                      >
                        <Save className="h-3.5 w-3.5" />
                        {saving ? "Saving..." : "Save"}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Edit3 className="h-3.5 w-3.5" /> Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", key: "name" },
                    { label: "Current Title", key: "title" },
                    { label: "Location", key: "location" },
                    { label: "Phone", key: "phone" },
                    { label: "LinkedIn URL", key: "linkedinUrl" },
                    { label: "GitHub URL", key: "githubUrl" },
                  ].map(({ label, key }) => (
                    <div key={key}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      {editing ? (
                        <input
                          type="text"
                          value={form[key as keyof typeof form]}
                          onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">
                          {form[key as keyof typeof form] || (
                            <span className="text-gray-400 italic">Not set</span>
                          )}
                        </p>
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Professional Summary</label>
                  {editing ? (
                    <textarea
                      value={form.bio}
                      onChange={(e) => setForm({ ...form, bio: e.target.value })}
                      rows={3}
                      placeholder="Tell employers about yourself..."
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      {profile?.bio || <span className="text-gray-400 italic">No summary added yet</span>}
                    </p>
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Award className="h-5 w-5 text-blue-600" />
                  Skills
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-sm px-3 py-1.5 rounded-lg"
                    >
                      {skill}
                      <button onClick={() => setSkills(skills.filter((s) => s !== skill))} className="text-blue-400 hover:text-blue-600">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                  {skills.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No skills added yet</p>
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") { e.preventDefault(); addSkill(); }
                    }}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                  >
                    <Plus className="h-4 w-4" /> Add
                  </button>
                </div>
                {skills.length > 0 && (
                  <button
                    onClick={handleSave}
                    className="mt-3 text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Save className="h-3.5 w-3.5" /> Save skills
                  </button>
                )}
              </div>

              {/* Work Experience (static placeholder) */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Work Experience
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" /> Add
                  </button>
                </div>
                <p className="text-sm text-gray-400 italic text-center py-4">
                  Work experience section — coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
