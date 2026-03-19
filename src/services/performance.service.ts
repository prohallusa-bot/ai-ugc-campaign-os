import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const performanceService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.performanceMetric.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.performanceMetric.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.performanceMetric.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("Performance", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.performanceMetric.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.performanceMetric.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.performanceMetric.delete({ where: { id } });
  },

  async getByPost(scheduledPostId: string) {
    return prisma.performanceMetric.findUnique({ where: { scheduledPostId } });
  },

  async getTopPerformers(limit = 10) {
    return prisma.performanceMetric.findMany({
      orderBy: { views7d: "desc" },
      take: limit,
    });
  },
};
