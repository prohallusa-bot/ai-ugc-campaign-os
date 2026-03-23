import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { creativeLibraryService } from "@/services";

const createCreativeSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["HOOK", "CTA", "AVATAR_REF", "VOICE_SAMPLE", "CONCEPT", "SCRIPT_TEMPLATE"]),
  content: z.string().min(1),
  tags: z.array(z.string()).optional().default([]),
  isWinner: z.boolean().optional().default(false),
});

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const result = await creativeLibraryService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createCreativeSchema.parse(body);
  const result = await creativeLibraryService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
