import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { updateIntegrationSchema } from "@/lib/validators";

export const PATCH = apiHandler(async (req, ctx) => {
  const { id } = await ctx.params;
  const body = await req.json();
  const validated = updateIntegrationSchema.parse(body);

  const result = await prisma.integration.update({
    where: { id },
    data: validated,
  });

  return NextResponse.json({ success: true, data: result });
});

export const DELETE = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;

  await prisma.integration.delete({
    where: { id },
  });

  return NextResponse.json({ success: true, data: { id } });
});
