import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { updateApprovalSettingsSchema } from "@/lib/validators";

export const GET = apiHandler(async () => {
  let settings = await prisma.approvalSettings.findUnique({
    where: { workspaceId: "default" },
  });

  if (!settings) {
    settings = await prisma.approvalSettings.create({
      data: { workspaceId: "default" },
    });
  }

  return NextResponse.json({ success: true, data: settings });
});

export const PATCH = apiHandler(async (req) => {
  const body = await req.json();
  const validated = updateApprovalSettingsSchema.parse(body);

  const existing = await prisma.approvalSettings.findUnique({
    where: { workspaceId: "default" },
  });

  if (!existing) {
    await prisma.approvalSettings.create({
      data: { workspaceId: "default" },
    });
  }

  const result = await prisma.approvalSettings.update({
    where: { workspaceId: "default" },
    data: validated,
  });

  return NextResponse.json({ success: true, data: result });
});
