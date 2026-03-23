import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const data = await prisma.variation.findMany({
    where: { batchId: id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ success: true, data });
});

const createVariationSchema = z.object({
  hookType: z.enum(["QUESTION", "BOLD_CLAIM", "STORY", "STATISTIC", "CONTROVERSY"]),
  avatarType: z.enum(["MALE_YOUNG", "MALE_MIDDLE", "FEMALE_YOUNG", "FEMALE_MIDDLE", "AI_GENERATED"]),
  lengthType: z.enum(["SHORT_15", "MEDIUM_30", "LONG_60"]),
  deliveryRegister: z.enum(["CASUAL", "AUTHORITATIVE", "EMOTIONAL", "HUMOROUS"]),
  platform: z.enum(["TIKTOK", "INSTAGRAM_REELS", "YOUTUBE_SHORTS", "FACEBOOK_REELS"]),
});

export const POST = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = createVariationSchema.parse(body);
  const result = await prisma.variation.create({
    data: { ...validated, batchId: id },
  });
  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
