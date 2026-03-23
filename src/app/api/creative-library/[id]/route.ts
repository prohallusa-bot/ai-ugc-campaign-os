import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api-handler";
import { creativeLibraryService } from "@/services";

const updateCreativeSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.enum(["HOOK", "CTA", "AVATAR_REF", "VOICE_SAMPLE", "CONCEPT", "SCRIPT_TEMPLATE"]).optional(),
  content: z.string().min(1).optional(),
  tags: z.array(z.string()).optional(),
  isWinner: z.boolean().optional(),
});

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const result = await creativeLibraryService.getById(id);
  return NextResponse.json({ success: true, data: result });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = updateCreativeSchema.parse(body);
  const result = await creativeLibraryService.update(id, validated);
  return NextResponse.json({ success: true, data: result });
});

export const DELETE = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  await creativeLibraryService.delete(id);
  return NextResponse.json({ success: true, data: { id } });
});
