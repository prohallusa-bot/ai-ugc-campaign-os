import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { updateGlobalSettingsSchema } from "@/lib/validators";

export const GET = apiHandler(async () => {
  let settings = await prisma.globalSettings.findUnique({
    where: { workspaceId: "default" },
  });

  if (!settings) {
    settings = await prisma.globalSettings.create({
      data: { workspaceId: "default" },
    });
  }

  return NextResponse.json({ success: true, data: settings });
});

export const PATCH = apiHandler(async (req) => {
  const body = await req.json();
  const validated = updateGlobalSettingsSchema.parse(body);

  // Ensure record exists
  const existing = await prisma.globalSettings.findUnique({
    where: { workspaceId: "default" },
  });

  if (!existing) {
    await prisma.globalSettings.create({
      data: { workspaceId: "default" },
    });
  }

  const result = await prisma.globalSettings.update({
    where: { workspaceId: "default" },
    data: validated,
  });

  return NextResponse.json({ success: true, data: result });
});
