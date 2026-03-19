import { prisma } from "@/lib/prisma";

export const globalSettingsService = {
  async get() {
    return prisma.globalSettings.findUnique({ where: { workspaceId: "default" } });
  },

  async upsert(input: Record<string, unknown>) {
    return prisma.globalSettings.upsert({
      where: { workspaceId: "default" },
      create: { ...input as any, workspaceId: "default" },
      update: input as any,
    });
  },
};
