import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const variationBatchService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.variationBatch.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.variationBatch.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.variationBatch.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("VariationBatch", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.variationBatch.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.variationBatch.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.variationBatch.delete({ where: { id } });
  },

  async listByScript(scriptId: string, params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.variationBatch.findMany({
        where: { scriptId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.variationBatch.count({ where: { scriptId } }),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },
};
