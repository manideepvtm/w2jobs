"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import {
  User,
  MapPin,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Plus,
  Edit3,
  Upload,
  CheckCircle,
  Award,
  X,
} from "lucide-react";

const initialSkills = ["React", "TypeScript", "Node.js", "Python", "AWS", "PostgreSQL"];

export default function ProfilePage() {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState("");
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sidebar */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto">
                    M
                  </div>
                  <button className="absolute bottom-0 right-0 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50">
                    <Edit3 className="h-3.5 w-3.5 text-gray-600" />
                  </button>
                </div>
                <h2 className="font-bold text-gray-900 text-lg">Manideep</h2>
                <p className="text-blue-600 text-sm font-medium">Senior Software Engineer</p>
                <p className="text-gray-500 text-xs mt-1 flex items-center justify-center gap-1">
                  <MapPin className="h-3 w-3" />
                  Austin, TX
                </p>

                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-gray-500">Profile complete</span>
                    <span className="text-xs font-semibold text-blue-600">72%</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: "72%" }} />
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="truncate">manideep@email.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <span>+1 (555) 123-4567</span>
                  </div>
                </div>
              </div>

              {/* W2 Status */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  W2 Authorization
                </h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-gray-700">Visa Status: H1B</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <span className="text-gray-700">W2 Authorized</span>
                  </div>
                  <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mt-3">
                    ✓ Eligible for W2 employment
                  </div>
                </div>
              </div>

              {/* Resume */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <h3 className="font-semibold text-gray-900 mb-3">Resume</h3>
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-blue-300 transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Upload Resume</p>
                  <p className="text-xs text-gray-400 mt-1">PDF, DOC up to 5MB</p>
                </div>
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-sm text-green-700">
                  <CheckCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Manideep_Resume.pdf uploaded</span>
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
                  <button
                    onClick={() => setEditingSection(editingSection === "basic" ? null : "basic")}
                    className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    <Edit3 className="h-3.5 w-3.5" />
                    {editingSection === "basic" ? "Save" : "Edit"}
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { label: "Full Name", value: "Manideep", type: "text" },
                    { label: "Current Title", value: "Senior Software Engineer", type: "text" },
                    { label: "Location", value: "Austin, TX", type: "text" },
                    { label: "Phone", value: "+1 (555) 123-4567", type: "tel" },
                    { label: "Expected Salary", value: "$130,000 - $160,000", type: "text" },
                    { label: "Availability", value: "2 weeks notice", type: "text" },
                  ].map(({ label, value, type }) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-gray-500 mb-1">{label}</label>
                      {editingSection === "basic" ? (
                        <input
                          type={type}
                          defaultValue={value}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="text-sm text-gray-900">{value}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-500 mb-1">Professional Summary</label>
                  {editingSection === "basic" ? (
                    <textarea
                      defaultValue="Experienced software engineer with 6+ years building scalable web applications. Passionate about clean code and great user experiences. W2 authorized, seeking direct hire opportunities."
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  ) : (
                    <p className="text-sm text-gray-600">
                      Experienced software engineer with 6+ years building scalable web applications. Passionate about clean code and great user experiences. W2 authorized, seeking direct hire opportunities.
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
                    <span key={skill} className="flex items-center gap-1.5 bg-blue-50 text-blue-700 border border-blue-200 text-sm px-3 py-1.5 rounded-lg">
                      {skill}
                      <button onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-blue-600">
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a skill..."
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addSkill()}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button onClick={addSkill} className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add
                  </button>
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Briefcase className="h-5 w-5 text-blue-600" />
                    Work Experience
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                <div className="space-y-5">
                  {[
                    {
                      title: "Senior Software Engineer",
                      company: "InnovateTech",
                      period: "Jan 2022 – Present",
                      desc: "Led development of microservices architecture serving 1M+ users. Built React/Node.js applications, improved system performance by 40%.",
                    },
                    {
                      title: "Software Engineer",
                      company: "WebSolutions Inc",
                      period: "Jun 2019 – Dec 2021",
                      desc: "Developed and maintained full-stack web applications using React and Django. Collaborated with cross-functional teams on product features.",
                    },
                  ].map((exp) => (
                    <div key={exp.title} className="relative pl-4 border-l-2 border-blue-200">
                      <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-600" />
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm">{exp.title}</h3>
                          <p className="text-blue-600 text-sm">{exp.company}</p>
                          <p className="text-gray-400 text-xs mt-0.5">{exp.period}</p>
                          <p className="text-gray-600 text-sm mt-2">{exp.desc}</p>
                        </div>
                        <button className="text-gray-400 hover:text-blue-600 ml-2">
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Education */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5 text-blue-600" />
                    Education
                  </h2>
                  <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    <Plus className="h-3.5 w-3.5" />
                    Add
                  </button>
                </div>
                <div className="relative pl-4 border-l-2 border-blue-200">
                  <div className="absolute -left-1.5 top-1 w-3 h-3 rounded-full bg-blue-600" />
                  <h3 className="font-semibold text-gray-900 text-sm">B.S. Computer Science</h3>
                  <p className="text-blue-600 text-sm">University of Texas at Austin</p>
                  <p className="text-gray-400 text-xs mt-0.5">2015 – 2019 · GPA: 3.7</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
