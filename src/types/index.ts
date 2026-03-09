export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: "Full-time" | "Contract" | "Part-time" | "Remote";
  salary: string;
  experience: string;
  skills: string[];
  description: string;
  requirements: string[];
  benefits: string[];
  postedAt: string;
  deadline: string;
  sponsorship: boolean;
  w2Only: boolean;
  logo: string;
  featured: boolean;
  category: string;
  applicants: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  location: string;
  phone: string;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  resumeUrl?: string;
  visaStatus: string;
  w2Authorization: boolean;
  preferredRoles: string[];
  preferredLocations: string[];
  expectedSalary: string;
  availability: string;
  profileComplete: number;
}

export interface WorkExperience {
  id: string;
  company: string;
  title: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startYear: string;
  endYear: string;
  gpa?: string;
}

export interface Application {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  appliedAt: string;
  status: "Applied" | "Reviewing" | "Interview" | "Offer" | "Rejected";
  notes?: string;
}
