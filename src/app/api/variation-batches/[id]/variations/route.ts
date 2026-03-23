import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { createVariationSchema } from "@/lib/validators";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const data = await prisma.variation.findMany({
    where: { batchId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data });
});

export const POST = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = createVariationSchema.omit({ batchId: true }).parse(body);
  const result = await prisma.variation.create({
    data: { ...validated, batchId: id },
  });
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
