import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";

export const GET = apiHandler(async () => {
  const [offers, scripts, variations, accounts] = await Promise.all([
    prisma.offer.count(),
    prisma.script.count(),
    prisma.variation.count(),
    prisma.account.count(),
  ]);

  return NextResponse.json({
    success: true,
    data: { offers, scripts, variations, accounts },
  });
});
