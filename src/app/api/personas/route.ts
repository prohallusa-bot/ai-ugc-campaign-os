import { NextRequest, NextResponse } from "next/server";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { personaService } from "@/services";
import { createPersonaSchema } from "@/lib/validators";

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const url = new URL(req.url);
  const offerId = url.searchParams.get("offerId");
  const result = offerId
    ? await personaService.listByOffer(offerId, pagination)
    : await personaService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createPersonaSchema.parse(body);
  const result = await personaService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
