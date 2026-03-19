import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const integrationService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.integration.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.integration.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.integration.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("Integration", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.integration.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.integration.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.integration.delete({ where: { id } });
  },

  async getByProvider(provider: string) {
    return prisma.integration.findUnique({ where: { provider: provider as any } });
  },

  async updateStatus(id: string, status: string, lastError?: string) {
    await this.getById(id);
    return prisma.integration.update({
      where: { id },
      data: {
        status: status as any,
        ...(lastError !== undefined && { lastError }),
      },
    });
  },

  async testConnection(id: string) {
    await this.getById(id);
    return prisma.integration.update({
      where: { id },
      data: { lastTestedAt: new Date() },
    });
  },
};
