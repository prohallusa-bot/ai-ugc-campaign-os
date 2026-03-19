import { prisma } from "@/lib/prisma";

export const approvalSettingsService = {
  async get() {
    return prisma.approvalSettings.findUnique({ where: { workspaceId: "default" } });
  },

  async upsert(input: Record<string, unknown>) {
    return prisma.approvalSettings.upsert({
      where: { workspaceId: "default" },
      create: { ...input as any, workspaceId: "default" },
      update: input as any,
    });
  },
};
