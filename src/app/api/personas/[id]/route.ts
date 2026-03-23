import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { personaService } from "@/services";
import { updatePersonaSchema } from "@/lib/validators";

export const GET = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  const result = await personaService.getById(id);
  return NextResponse.json({ success: true, data: result });
});

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = updatePersonaSchema.parse(body);
  const result = await personaService.update(id, validated);
  return NextResponse.json({ success: true, data: result });
});

export const DELETE = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;
  await personaService.delete(id);
  return NextResponse.json({ success: true, data: { id } });
});
