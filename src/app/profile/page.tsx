"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  User, MapPin, Phone, Mail, Linkedin, Github,
  Edit2, Check, X, Plus, Loader2, FileText, Briefcase
} from "lucide-react";

type UserProfile = {
  id: string;
  name: string;
  email: string;
  title?: string;
  bio?: string;
  location?: string;
  phone?: string;
  skills: string[];
  linkedinUrl?: string;
  githubUrl?: string;
  resumeUrl?: string;
};

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Editable form state
  const [form, setForm] = useState({
    name: "", title: "", bio: "", location: "", phone: "",
    linkedinUrl: "", githubUrl: "",
  });
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    if (status === "authenticated") {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then(({ user }) => {
          setProfile(user);
          setForm({
            name: user.name ?? "",
            title: user.title ?? "",
            bio: user.bio ?? "",
            location: user.location ?? "",
            phone: user.phone ?? "",
            linkedinUrl: user.linkedinUrl ?? "",
            githubUrl: user.githubUrl ?? "",
          });
          setSkills(user.skills ?? []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [status, router]);

  const startEditing = () => {
    setEditing(true);
    setSaveError("");
    setSaveSuccess(false);
  };

  const cancelEditing = () => {
    if (profile) {
      setForm({
        name: profile.name ?? "",
        title: profile.title ?? "",
        bio: profile.bio ?? "",
        location: profile.location ?? "",
        phone: profile.phone ?? "",
        linkedinUrl: profile.linkedinUrl ?? "",
        githubUrl: profile.githubUrl ?? "",
      });
      setSkills(profile.skills ?? []);
    }
    setEditing(false);
    setSaveError("");
  };

  const saveProfile = async () => {
    setSaving(true);
    setSaveError("");
    const res = await fetch("/api/user/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, skills }),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) {
      setSaveError(data.error ?? "Failed to save.");
    } else {
      setProfile(data.user);
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }
  };

  const addSkill = () => {
    const s = newSkill.trim();
    if (s && !skills.includes(s)) {
      setSkills([...skills, s]);
      setNewSkill("");
    }
  };

  const removeSkill = (s: string) => setSkills(skills.filter((sk) => sk !== s));

  const initials = profile?.name
    ? profile.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  // Profile completeness
  const fields = [profile?.name, profile?.title, profile?.bio, profile?.phone, profile?.resumeUrl, profile?.linkedinUrl];
  const filled = fields.filter(Boolean).length + (skills.length > 0 ? 1 : 0);
  const strength = Math.round((filled / 7) * 100);

  if (status === "loading" || loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {saveSuccess && (
            <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
              <Check className="h-4 w-4" /> Profile saved successfully.
            </div>
          )}
          {saveError && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {saveError}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="space-y-4">
              {/* Avatar & basic info */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="h-20 w-20 rounded-full bg-blue-600 text-white flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {initials}
                </div>
                <h2 className="font-bold text-gray-900 text-lg">{profile?.name}</h2>
                {profile?.title && <p className="text-gray-500 text-sm mt-1">{profile.title}</p>}
                {profile?.location && (
                  <p className="text-gray-400 text-xs mt-1 flex items-center justify-center gap-1">
                    <MapPin className="h-3 w-3" />{profile.location}
                  </p>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-2 text-sm text-left">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{profile?.email}</span>
                  </div>
                  {profile?.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone className="h-4 w-4 text-gray-400" />
                      {profile.phone}
                    </div>
                  )}
                  {profile?.linkedinUrl && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Linkedin className="h-4 w-4 text-gray-400" />
                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="truncate text-blue-600 hover:underline text-xs">
                        LinkedIn
                      </a>
                    </div>
                  )}
                  {profile?.githubUrl && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Github className="h-4 w-4 text-gray-400" />
                      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="truncate text-blue-600 hover:underline text-xs">
                        GitHub
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Profile strength */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Profile Strength</h3>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-gray-600">{strength}% complete</span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    strength >= 80 ? "bg-green-100 text-green-700"
                    : strength >= 50 ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                  }`}>
                    {strength >= 80 ? "Strong" : strength >= 50 ? "Good" : "Weak"}
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all" style={{ width: `${strength}%` }} />
                </div>
                <ul className="mt-3 space-y-1.5">
                  {[
                    { label: "Name", done: !!profile?.name },
                    { label: "Job title", done: !!profile?.title },
                    { label: "Bio", done: !!profile?.bio },
                    { label: "Skills", done: skills.length > 0 },
                    { label: "Phone", done: !!profile?.phone },
                    { label: "Resume", done: !!profile?.resumeUrl },
                    { label: "LinkedIn", done: !!profile?.linkedinUrl },
                  ].map(({ label, done }) => (
                    <li key={label} className={`flex items-center gap-2 text-xs ${done ? "text-gray-500" : "text-gray-400"}`}>
                      <span className={`h-4 w-4 rounded-full flex items-center justify-center text-white text-[10px] flex-shrink-0 ${done ? "bg-green-500" : "bg-gray-200"}`}>
                        {done ? "✓" : ""}
                      </span>
                      {label}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resume */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm">Resume</h3>
                {profile?.resumeUrl ? (
                  <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-blue-600 hover:underline">
                    <FileText className="h-4 w-4" /> View Resume
                  </a>
                ) : (
                  <p className="text-sm text-gray-400">No resume uploaded yet.</p>
                )}
              </div>
            </div>

            {/* Main content */}
            <div className="lg:col-span-2 space-y-4">
              {/* Basic Info */}
              <div className="bg-white rounded-xl border border-gray-200">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" /> Basic Information
                  </h2>
                  {!editing ? (
                    <button onClick={startEditing} className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium">
                      <Edit2 className="h-3.5 w-3.5" /> Edit
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button onClick={cancelEditing} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700">
                        <X className="h-3.5 w-3.5" /> Cancel
                      </button>
                      <button onClick={saveProfile} disabled={saving}
                        className="flex items-center gap-1.5 text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg hover:bg-blue-700 disabled:opacity-60 transition-colors">
                        {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                        Save
                      </button>
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Full Name</label>
                      {editing ? (
                        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      ) : (
                        <p className="text-sm text-gray-900">{profile?.name || <span className="text-gray-400 italic">Not set</span>}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Job Title</label>
                      {editing ? (
                        <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. Senior Software Engineer"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      ) : (
                        <p className="text-sm text-gray-900">{profile?.title || <span className="text-gray-400 italic">Not set</span>}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Location</label>
                      {editing ? (
                        <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })}
                          placeholder="e.g. San Francisco, CA"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      ) : (
                        <p className="text-sm text-gray-900">{profile?.location || <span className="text-gray-400 italic">Not set</span>}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone</label>
                      {editing ? (
                        <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                          placeholder="+1 (555) 000-0000"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      ) : (
                        <p className="text-sm text-gray-900">{profile?.phone || <span className="text-gray-400 italic">Not set</span>}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">LinkedIn URL</label>
                      {editing ? (
                        <input value={form.linkedinUrl} onChange={(e) => setForm({ ...form, linkedinUrl: e.target.value })}
                          placeholder="https://linkedin.com/in/..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      ) : (
                        <p className="text-sm">{profile?.linkedinUrl
                          ? <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.linkedinUrl}</a>
                          : <span className="text-gray-400 italic">Not set</span>}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1.5">GitHub URL</label>
                      {editing ? (
                        <input value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                          placeholder="https://github.com/..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      ) : (
                        <p className="text-sm">{profile?.githubUrl
                          ? <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{profile.githubUrl}</a>
                          : <span className="text-gray-400 italic">Not set</span>}
                        </p>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Bio</label>
                    {editing ? (
                      <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        rows={4} placeholder="Tell employers about yourself..."
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
                    ) : (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {profile?.bio || <span className="text-gray-400 italic">No bio yet. Click Edit to add one.</span>}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" /> Skills
                </h2>
                <div className="flex flex-wrap gap-2 mb-4">
                  {skills.map((skill) => (
                    <span key={skill} className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-sm">
                      {skill}
                      {editing && (
                        <button onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-blue-600">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                  {skills.length === 0 && <p className="text-sm text-gray-400 italic">No skills added yet.</p>}
                </div>
                {editing && (
                  <div className="flex gap-2">
                    <input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                      placeholder="Add a skill (press Enter)"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button onClick={addSkill}
                      className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">
                      <Plus className="h-4 w-4" /> Add
                    </button>
                  </div>
                )}
                {!editing && (
                  <button onClick={startEditing} className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1.5">
                    <Plus className="h-4 w-4" /> Add skills
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
