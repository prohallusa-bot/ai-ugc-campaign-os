import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { promptTemplateService } from "@/services";

const createTemplateSchema = z.object({
  name: z.string().min(1),
  category: z.enum(["HOOK_GENERATION", "SCRIPT_WRITING", "PERSONA_RESEARCH", "CHECKLIST_SCORING", "WEEKLY_REVIEW", "OPTIMIZATION"]),
  content: z.string().min(1),
  isDefault: z.boolean().optional().default(false),
});

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const result = await promptTemplateService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createTemplateSchema.parse(body);
  const result = await promptTemplateService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
