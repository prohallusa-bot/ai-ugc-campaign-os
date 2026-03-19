import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const weeklyReviewService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.weeklyReview.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.weeklyReview.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.weeklyReview.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("WeeklyReview", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.weeklyReview.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.weeklyReview.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.weeklyReview.delete({ where: { id } });
  },

  async getByWeek(weekStart: Date) {
    return prisma.weeklyReview.findUnique({ where: { weekStart } });
  },
};
