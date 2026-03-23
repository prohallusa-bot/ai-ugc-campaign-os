import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const variationService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.variation.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.variation.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.variation.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("Variation", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.variation.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    return prisma.variation.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    return prisma.variation.delete({ where: { id } });
  },

  async listByBatch(batchId: string, params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.variation.findMany({
        where: { batchId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.variation.count({ where: { batchId } }),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async updateStatus(id: string, status: string) {
    return prisma.variation.update({ where: { id }, data: { status: status as any } });
  },
};
