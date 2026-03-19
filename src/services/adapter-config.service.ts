import { prisma } from "@/lib/prisma";

export const adapterConfigService = {
  async get() {
    return prisma.adapterConfig.findUnique({ where: { workspaceId: "default" } });
  },

  async upsert(input: Record<string, unknown>) {
    return prisma.adapterConfig.upsert({
      where: { workspaceId: "default" },
      create: { ...input as any, workspaceId: "default" },
      update: input as any,
    });
  },
};
