import { NextRequest, NextResponse } from "next/server";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { promptTemplateService } from "@/services";
import { createPromptTemplateSchema } from "@/lib/validators";

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const result = await promptTemplateService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createPromptTemplateSchema.parse(body);
  const result = await promptTemplateService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
