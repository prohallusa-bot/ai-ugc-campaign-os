import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { accountService } from "@/services";
import { updateAccountSchema } from "@/lib/validators";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const result = await accountService.getById(id);
  return NextResponse.json({ success: true, data: result });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = updateAccountSchema.parse(body);
  const result = await accountService.update(id, validated);
  return NextResponse.json({ success: true, data: result });
});

export const DELETE = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  await accountService.delete(id);
  return NextResponse.json({ success: true, data: { id } });
});
