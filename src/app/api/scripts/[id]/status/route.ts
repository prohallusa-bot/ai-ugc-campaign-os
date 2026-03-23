import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { apiHandler } from "@/lib/api-handler";
import { scriptService } from "@/services";

const updateStatusSchema = z.object({
  status: z.enum([
    "DRAFT",
    "CHECKLIST_PENDING",
    "APPROVED",
    "REJECTED",
    "ARCHIVED",
  ]),
});

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const { status } = updateStatusSchema.parse(body);
  const result = await scriptService.updateStatus(id, status);
  return NextResponse.json({ success: true, data: result });
});
