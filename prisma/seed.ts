import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Seed jobs
  const jobs = [
    {
      title: "Senior Software Engineer",
      company: "TechCorp Inc.",
      location: "Austin, TX",
      type: "Full-Time",
      salary: "$120,000 - $160,000",
      description:
        "We are looking for a Senior Software Engineer to join our growing team. You will design, build, and maintain efficient, reusable, and reliable code. You will collaborate with cross-functional teams to define, design, and ship new features.",
      requirements: [
        "5+ years of software engineering experience",
        "Strong proficiency in TypeScript and React",
        "Experience with Node.js and REST APIs",
        "Experience with cloud platforms (AWS/GCP/Azure)",
        "Strong understanding of software design patterns",
      ],
      benefits: [
        "Competitive salary + equity",
        "Health, dental & vision insurance",
        "401(k) with company match",
        "Remote-friendly culture",
        "Annual learning budget",
      ],
      remote: true,
      featured: true,
    },
    {
      title: "Product Manager",
      company: "StartupXYZ",
      location: "San Francisco, CA",
      type: "Full-Time",
      salary: "$130,000 - $170,000",
      description:
        "Join our product team as a Product Manager to help shape the future of our platform. You will work closely with engineering, design, and business teams to define product strategy and roadmap.",
      requirements: [
        "3+ years of product management experience",
        "Strong analytical and problem-solving skills",
        "Experience with agile methodologies",
        "Excellent communication skills",
        "Data-driven decision making",
      ],
      benefits: [
        "Competitive salary + stock options",
        "Unlimited PTO",
        "Health benefits",
        "Flexible work arrangements",
        "Weekly team lunches",
      ],
      remote: false,
      featured: true,
    },
    {
      title: "Data Engineer",
      company: "DataDriven Co.",
      location: "New York, NY",
      type: "Full-Time",
      salary: "$110,000 - $145,000",
      description:
        "We are seeking a Data Engineer to build and maintain our data infrastructure. You will design data pipelines, ensure data quality, and work with the analytics team to provide insights.",
      requirements: [
        "3+ years of data engineering experience",
        "Proficiency in Python and SQL",
        "Experience with data pipeline tools (Airflow, dbt)",
        "Knowledge of cloud data warehouses",
        "Experience with Spark or similar frameworks",
      ],
      benefits: [
        "Health & wellness benefits",
        "401(k) matching",
        "Remote work options",
        "Professional development budget",
      ],
      remote: true,
      featured: false,
    },
    {
      title: "UX Designer",
      company: "DesignFirst Agency",
      location: "Chicago, IL",
      type: "Full-Time",
      salary: "$85,000 - $115,000",
      description:
        "Looking for a UX Designer to create intuitive and engaging user experiences. You will conduct user research, create wireframes and prototypes, and collaborate with engineers to ship great products.",
      requirements: [
        "3+ years of UX design experience",
        "Proficiency in Figma",
        "Portfolio demonstrating strong design thinking",
        "Experience with user research methodologies",
        "Understanding of accessibility standards",
      ],
      benefits: [
        "Creative work environment",
        "Health benefits",
        "Design conference budget",
        "Flexible hours",
      ],
      remote: false,
      featured: false,
    },
    {
      title: "DevOps Engineer",
      company: "CloudScale Systems",
      location: "Remote",
      type: "Full-Time",
      salary: "$115,000 - $150,000",
      description:
        "Join our infrastructure team to build and maintain scalable cloud systems. You will manage CI/CD pipelines, Kubernetes clusters, and work to improve deployment reliability and speed.",
      requirements: [
        "4+ years of DevOps/SRE experience",
        "Strong experience with Kubernetes and Docker",
        "Proficiency with AWS or GCP",
        "Experience with Terraform or Pulumi",
        "Strong scripting skills (Bash, Python)",
      ],
      benefits: [
        "Fully remote position",
        "Competitive salary",
        "Home office stipend",
        "Conference speaking budget",
        "Top-tier health coverage",
      ],
      remote: true,
      featured: true,
    },
    {
      title: "Marketing Manager",
      company: "GrowthLabs",
      location: "Seattle, WA",
      type: "Full-Time",
      salary: "$95,000 - $125,000",
      description:
        "Lead our marketing efforts to drive growth and brand awareness. You will develop and execute marketing campaigns, manage a small team, and analyze performance metrics.",
      requirements: [
        "5+ years of marketing experience",
        "Experience with digital marketing channels",
        "Strong data analysis skills",
        "Team leadership experience",
        "B2B SaaS experience preferred",
      ],
      benefits: [
        "Competitive compensation",
        "Equity package",
        "Generous PTO",
        "Marketing conference budget",
        "Health & wellness benefits",
      ],
      remote: false,
      featured: false,
    },
    {
      title: "Full Stack Developer",
      company: "FinTech Solutions",
      location: "Boston, MA",
      type: "Contract",
      salary: "$75 - $95/hour",
      description:
        "6-month contract opportunity to help build a new financial platform. Work with a modern tech stack including Next.js, Node.js, and PostgreSQL to deliver key features.",
      requirements: [
        "4+ years of full-stack development",
        "Strong Next.js and TypeScript skills",
        "PostgreSQL experience",
        "Understanding of financial systems",
        "Ability to work independently",
      ],
      benefits: [
        "Competitive hourly rate",
        "Fully remote",
        "Flexible schedule",
        "Opportunity for full-time conversion",
      ],
      remote: true,
      featured: false,
    },
    {
      title: "Customer Success Manager",
      company: "SaaS Platform Co.",
      location: "Denver, CO",
      type: "Full-Time",
      salary: "$70,000 - $95,000",
      description:
        "Help our customers achieve their goals with our platform. You will onboard new customers, drive adoption, identify expansion opportunities, and ensure high retention rates.",
      requirements: [
        "3+ years of customer success experience",
        "Strong communication and empathy skills",
        "SaaS product experience",
        "CRM software proficiency",
        "Data-driven mindset",
      ],
      benefits: [
        "Base + performance bonus",
        "Health benefits",
        "401(k) with matching",
        "Monthly team events",
        "Career growth opportunities",
      ],
      remote: false,
      featured: false,
    },
  ];

  for (const job of jobs) {
    await prisma.job.upsert({
      where: { id: `seed-${job.title.toLowerCase().replace(/\s+/g, "-")}` },
      update: {},
      create: {
        id: `seed-${job.title.toLowerCase().replace(/\s+/g, "-")}`,
        ...job,
      },
    });
  }

  console.log(`Seeded ${jobs.length} jobs`);
  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
