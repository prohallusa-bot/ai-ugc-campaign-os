import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { updateCostControlSchema } from "@/lib/validators";

export const GET = apiHandler(async () => {
  let settings = await prisma.costControl.findUnique({
    where: { workspaceId: "default" },
  });

  if (!settings) {
    settings = await prisma.costControl.create({
      data: { workspaceId: "default" },
    });
  }

  return NextResponse.json({ success: true, data: settings });
});

export const PATCH = apiHandler(async (req) => {
  const body = await req.json();
  const validated = updateCostControlSchema.parse(body);

  const result = await prisma.costControl.upsert({
    where: { workspaceId: "default" },
    create: { ...validated, workspaceId: "default" },
    update: validated,
  });

  return NextResponse.json({ success: true, data: result });
});
