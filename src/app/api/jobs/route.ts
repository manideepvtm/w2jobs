import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const type = searchParams.get("type") || "";
  const location = searchParams.get("location") || "";
  const remote = searchParams.get("remote") === "true";

  const jobs = await prisma.job.findMany({
    where: {
      active: true,
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { company: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } },
        ],
      }),
      ...(type && { type }),
      ...(location && {
        location: { contains: location, mode: "insensitive" },
      }),
      ...(remote && { remote: true }),
    },
    orderBy: [{ featured: "desc" }, { postedAt: "desc" }],
    include: {
      _count: { select: { applications: true } },
    },
  });

  return NextResponse.json({ jobs });
}
