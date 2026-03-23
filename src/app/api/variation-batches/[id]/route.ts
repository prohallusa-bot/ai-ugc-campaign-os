import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { variationBatchService } from "@/services";
import { updateVariationBatchSchema } from "@/lib/validators";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const result = await variationBatchService.getById(id);
  return NextResponse.json({ success: true, data: result });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = updateVariationBatchSchema.parse(body);
  const result = await variationBatchService.update(id, validated);
  return NextResponse.json({ success: true, data: result });
});

export const DELETE = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  await variationBatchService.delete(id);
  return NextResponse.json({ success: true, data: { id } });
});
