import { NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { prisma } from "@/lib/prisma";
import { createIntegrationSchema } from "@/lib/validators";

export const GET = apiHandler(async () => {
  const integrations = await prisma.integration.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ success: true, data: integrations });
});

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const validated = createIntegrationSchema.parse(body);

  const result = await prisma.integration.create({
    data: validated,
  });

  return NextResponse.json({ success: true, data: result }, { status: 201 });
});
