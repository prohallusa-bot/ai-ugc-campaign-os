import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { accountService } from "@/services";
import { z } from "zod";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const result = await accountService.getById(id);
  return NextResponse.json({ success: true, data: result });
});

const updateAccountSchema = z.object({
  platform: z.enum(["TIKTOK", "INSTAGRAM_REELS", "YOUTUBE_SHORTS", "FACEBOOK_REELS"]).optional(),
  handle: z.string().min(1).optional(),
  tier: z.enum(["SEED", "GROWTH", "SCALE"]).optional(),
  dailyPostTarget: z.number().int().min(1).optional(),
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
