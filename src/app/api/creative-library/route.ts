import { NextRequest, NextResponse } from "next/server";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { creativeLibraryService } from "@/services";
import { createCreativeLibrarySchema } from "@/lib/validators";

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const result = await creativeLibraryService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createCreativeLibrarySchema.parse(body);
  const result = await creativeLibraryService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
