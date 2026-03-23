import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const accountService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.account.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.account.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.account.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("Account", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.account.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    return prisma.account.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    return prisma.account.delete({ where: { id } });
  },

  async getByPlatformHandle(platform: string, handle: string) {
    return prisma.account.findUnique({
      where: { platform_handle: { platform: platform as any, handle } },
    });
  },

  async updateHealth(id: string, healthStatus: string) {
    return prisma.account.update({
      where: { id },
      data: { healthStatus: healthStatus as any },
    });
  },
};
