import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";

export const GET = apiHandler(async () => {
  const [
    totalScripts,
    approvedScripts,
    totalVariations,
    completedVariations,
    totalAccounts,
    totalPosts,
    publishedPosts,
  ] = await Promise.all([
    prisma.script.count(),
    prisma.script.count({ where: { status: "APPROVED" } }),
    prisma.variation.count(),
    prisma.variation.count({ where: { status: "RENDER_DONE" } }),
    prisma.account.count(),
    prisma.scheduledPost.count(),
    prisma.scheduledPost.count({ where: { status: "PUBLISHED" } }),
  ]);

  const recentMetrics = await prisma.performanceMetric.findMany({
    take: 20,
    orderBy: { createdAt: "desc" },
    include: { scheduledPost: { include: { account: true } } },
  });

  return NextResponse.json({
    success: true,
    data: {
      totalScripts,
      approvedScripts,
      totalVariations,
      completedVariations,
      totalAccounts,
      totalPosts,
      publishedPosts,
      recentMetrics,
    },
  });
});
