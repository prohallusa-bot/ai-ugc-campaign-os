import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const checklists = await prisma.scriptChecklist.findMany({
    where: { scriptId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data: checklists });
});

const createChecklistSchema = z.object({
  scriptId: z.string().optional(),
  score: z.number().int().min(0).max(100),
  notes: z.string().optional(),
});

export const POST = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = createChecklistSchema.parse(body);

  const checklist = await prisma.scriptChecklist.create({
    data: {
      scriptId: id,
      score: validated.score,
      notes: validated.notes,
    },
  });

  return NextResponse.json({ success: true, data: checklist }, { status: 201 });
});
