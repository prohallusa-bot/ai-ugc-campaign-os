import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api-handler";
import { promptTemplateService } from "@/services";

const updateTemplateSchema = z.object({
  name: z.string().min(1).optional(),
  category: z.enum(["HOOK_GENERATION", "SCRIPT_WRITING", "PERSONA_RESEARCH", "CHECKLIST_SCORING", "WEEKLY_REVIEW", "OPTIMIZATION"]).optional(),
  content: z.string().min(1).optional(),
  isDefault: z.boolean().optional(),
});

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const result = await promptTemplateService.getById(id);
  return NextResponse.json({ success: true, data: result });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = updateTemplateSchema.parse(body);
  const result = await promptTemplateService.update(id, validated);
  return NextResponse.json({ success: true, data: result });
});

export const DELETE = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  await promptTemplateService.delete(id);
  return NextResponse.json({ success: true, data: { id } });
});
