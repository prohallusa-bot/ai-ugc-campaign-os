import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { offerService } from "@/services";
import { updateOfferSchema } from "@/lib/validators";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const result = await offerService.getById(id);
  return NextResponse.json({ success: true, data: result });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = updateOfferSchema.parse(body);
  const result = await offerService.update(id, validated);
  return NextResponse.json({ success: true, data: result });
});

export const DELETE = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  await offerService.delete(id);
  return NextResponse.json({ success: true, data: { id } });
});
