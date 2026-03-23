import { NextRequest, NextResponse } from "next/server";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { variationBatchService } from "@/services";
import { createVariationBatchSchema } from "@/lib/validators";

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const result = await variationBatchService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createVariationBatchSchema.parse(body);
  const result = await variationBatchService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
