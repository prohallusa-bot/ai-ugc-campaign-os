import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const platformRuleService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.platformRule.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.platformRule.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.platformRule.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("PlatformRule", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.platformRule.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.platformRule.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.platformRule.delete({ where: { id } });
  },

  async getByPlatform(platform: string) {
    return prisma.platformRule.findUnique({ where: { platform: platform as any } });
  },
};
