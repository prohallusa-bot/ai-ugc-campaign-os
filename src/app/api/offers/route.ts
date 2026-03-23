import { NextRequest, NextResponse } from "next/server";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { offerService } from "@/services";
import { createOfferSchema } from "@/lib/validators";

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const result = await offerService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createOfferSchema.parse(body);
  const result = await offerService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
