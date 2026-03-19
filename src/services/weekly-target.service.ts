import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const weeklyTargetService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.weeklyTarget.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.weeklyTarget.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.weeklyTarget.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("WeeklyTarget", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.weeklyTarget.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.weeklyTarget.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.weeklyTarget.delete({ where: { id } });
  },

  async getByWeek(weekStart: Date) {
    return prisma.weeklyTarget.findUnique({ where: { weekStart } });
  },
};
