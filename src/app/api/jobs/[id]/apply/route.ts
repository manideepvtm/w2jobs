import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { prisma } from "@/lib/prisma";
import { getUserPlan, PLANS } from "@/lib/stripe";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: jobId } = await params;
  const { coverLetter } = await req.json();

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      stripePriceId: true,
      stripeCurrentPeriodEnd: true,
      _count: { select: { applications: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Check subscription limits
  const isSubscribed =
    user.stripeCurrentPeriodEnd &&
    user.stripeCurrentPeriodEnd > new Date();

  const plan = getUserPlan(isSubscribed ? user.stripePriceId : null);

  const planData = PLANS[plan as keyof typeof PLANS]
  if (
    planData.applicationLimit !== null &&
    user._count.applications >= planData.applicationLimit
  ) {
    return NextResponse.json(
      {
        error: `You've reached your ${planData.applicationLimit} application limit for the free plan. Upgrade to Pro for unlimited applications.`,
        upgradeRequired: true,
      },
      { status: 403 }
    );
  }

  // Check if already applied
  const existing = await prisma.application.findUnique({
    where: { userId_jobId: { userId: session.user.id, jobId } },
  });

  if (existing) {
    return NextResponse.json(
      { error: "You have already applied to this job" },
      { status: 409 }
    );
  }

  const application = await prisma.application.create({
    data: {
      userId: session.user.id,
      jobId,
      coverLetter,
    },
    include: { job: true },
  });

  return NextResponse.json({ application }, { status: 201 });
}
