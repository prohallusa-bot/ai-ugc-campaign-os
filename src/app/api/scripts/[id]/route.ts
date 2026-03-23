import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { scriptService } from "@/services";
import { updateScriptSchema } from "@/lib/validators";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const result = await scriptService.getById(id);
  return NextResponse.json({ success: true, data: result });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = updateScriptSchema.parse(body);
  const result = await scriptService.update(id, validated);
  return NextResponse.json({ success: true, data: result });
});

export const DELETE = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  await scriptService.delete(id);
  return NextResponse.json({ success: true, data: { id } });
});
