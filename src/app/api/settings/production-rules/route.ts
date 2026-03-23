import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { updateProductionRuleSchema } from "@/lib/validators";

export const GET = apiHandler(async () => {
  let rules = await prisma.productionRule.findUnique({
    where: { workspaceId: "default" },
  });

  if (!rules) {
    rules = await prisma.productionRule.create({
      data: { workspaceId: "default" },
    });
  }

  return NextResponse.json({ success: true, data: rules });
});

export const PATCH = apiHandler(async (req) => {
  const body = await req.json();
  const validated = updateProductionRuleSchema.parse(body);

  const result = await prisma.productionRule.upsert({
    where: { workspaceId: "default" },
    create: { ...validated, workspaceId: "default" },
    update: validated,
  });

  return NextResponse.json({ success: true, data: result });
});
