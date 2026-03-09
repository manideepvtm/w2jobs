import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { prisma } from "@/lib/prisma";
import { getUserPlan } from "@/lib/stripe";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      bio: true,
      location: true,
      phone: true,
      resumeUrl: true,
      skills: true,
      linkedinUrl: true,
      githubUrl: true,
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
      stripeCustomerId: true,
      _count: { select: { applications: true, savedJobs: true } },
      applications: {
        orderBy: { appliedAt: "desc" },
        take: 10,
        include: {
          job: {
            select: { id: true, title: true, company: true, location: true, type: true },
          },
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const isSubscribed =
    user.stripeCurrentPeriodEnd && user.stripeCurrentPeriodEnd > new Date();

  const plan = getUserPlan(isSubscribed ? user.stripePriceId : null);

  return NextResponse.json({ user, plan, isSubscribed: !!isSubscribed });
}

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, title, bio, location, phone, skills, linkedinUrl, githubUrl } = body;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name,
      title,
      bio,
      location,
      phone,
      skills: Array.isArray(skills) ? skills : [],
      linkedinUrl,
      githubUrl,
    },
    select: {
      id: true,
      name: true,
      email: true,
      title: true,
      bio: true,
      location: true,
      phone: true,
      skills: true,
      linkedinUrl: true,
      githubUrl: true,
    },
  });

  return NextResponse.json({ user });
}
