import { NextResponse } from "next/server";
import { auth } from "@/../auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  const [user, applicationStats, recentApplications, savedJobsCount] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        title: true,
        skills: true,
        resumeUrl: true,
        bio: true,
        phone: true,
        linkedinUrl: true,
        stripePriceId: true,
      },
    }),
    prisma.application.groupBy({
      by: ["status"],
      where: { userId },
      _count: { status: true },
    }),
    prisma.application.findMany({
      where: { userId },
      orderBy: { appliedAt: "desc" },
      take: 5,
      include: {
        job: {
          select: { title: true, company: true, location: true },
        },
      },
    }),
    prisma.savedJob.count({ where: { userId } }),
  ]);

  const totalApplications = applicationStats.reduce((sum, s) => sum + s._count.status, 0);
  const interviews = applicationStats.find((s) => s.status === "INTERVIEW")?._count.status ?? 0;

  // Profile completeness
  const fields = [user?.name, user?.title, user?.bio, user?.phone, user?.resumeUrl, user?.linkedinUrl];
  const filled = fields.filter(Boolean).length + (user?.skills && user.skills.length > 0 ? 1 : 0);
  const profileStrength = Math.round((filled / 7) * 100);

  return NextResponse.json({
    user,
    stats: {
      totalApplications,
      interviews,
      savedJobs: savedJobsCount,
    },
    recentApplications: recentApplications.map((a) => ({
      id: a.id,
      jobTitle: a.job.title,
      company: a.job.company,
      location: a.job.location,
      status: a.status,
      appliedAt: a.appliedAt,
    })),
    profileStrength,
  });
}
