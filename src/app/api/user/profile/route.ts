import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/../auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

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
      skills: true,
      linkedinUrl: true,
      githubUrl: true,
      resumeUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, title, bio, location, phone, skills, linkedinUrl, githubUrl } = body;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(name !== undefined && { name }),
      ...(title !== undefined && { title }),
      ...(bio !== undefined && { bio }),
      ...(location !== undefined && { location }),
      ...(phone !== undefined && { phone }),
      ...(skills !== undefined && { skills }),
      ...(linkedinUrl !== undefined && { linkedinUrl }),
      ...(githubUrl !== undefined && { githubUrl }),
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
      resumeUrl: true,
    },
  });

  return NextResponse.json({ user });
}
