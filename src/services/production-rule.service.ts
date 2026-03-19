import { prisma } from "@/lib/prisma";

export const productionRuleService = {
  async get() {
    return prisma.productionRule.findUnique({ where: { workspaceId: "default" } });
  },

  async upsert(input: Record<string, unknown>) {
    return prisma.productionRule.upsert({
      where: { workspaceId: "default" },
      create: { ...input as any, workspaceId: "default" },
      update: input as any,
    });
  },
};
