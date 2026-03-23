import { NextRequest, NextResponse } from "next/server";
import { apiHandler, parsePagination } from "@/lib/api-handler";
import { accountService } from "@/services";
import { z } from "zod";

export const GET = apiHandler(async (req) => {
  const pagination = parsePagination(req);
  const result = await accountService.list(pagination);
  return NextResponse.json({ success: true, data: result });
});

const createAccountSchema = z.object({
  platform: z.enum(["TIKTOK", "INSTAGRAM_REELS", "YOUTUBE_SHORTS", "FACEBOOK_REELS"]),
  handle: z.string().min(1),
  tier: z.enum(["SEED", "GROWTH", "SCALE"]).optional(),
  dailyPostTarget: z.number().int().min(1).optional(),
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createAccountSchema.parse(body);
  const result = await accountService.create(validated);
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
