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

  const result = await prisma.globalSettings.upsert({
    where: { workspaceId: "default" },
    create: { ...validated, workspaceId: "default" },
    update: validated,
  });

  return NextResponse.json({ success: true, data: result });
});
