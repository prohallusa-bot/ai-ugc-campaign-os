import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const jobLogService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.jobLog.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { startedAt: "desc" },
      }),
      prisma.jobLog.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.jobLog.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("JobLog", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.jobLog.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.jobLog.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.jobLog.delete({ where: { id } });
  },

  async getRecent(limit = 20) {
    return prisma.jobLog.findMany({
      orderBy: { startedAt: "desc" },
      take: limit,
    });
  },

  async complete(id: string, costEstimate?: number) {
    await this.getById(id);
    return prisma.jobLog.update({
      where: { id },
      data: {
        status: "COMPLETE" as any,
        endedAt: new Date(),
        ...(costEstimate !== undefined && { costEstimate }),
      },
    });
  },
};
