import { prisma } from "@/lib/prisma";

export const costControlService = {
  async get() {
    return prisma.costControl.findUnique({ where: { workspaceId: "default" } });
  },

  async upsert(input: Record<string, unknown>) {
    return prisma.costControl.upsert({
      where: { workspaceId: "default" },
      create: { ...input as any, workspaceId: "default" },
      update: input as any,
    });
  },
};
