import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const creativeLibraryService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.creativeLibrary.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.creativeLibrary.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.creativeLibrary.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("CreativeLibrary", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.creativeLibrary.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    return prisma.creativeLibrary.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    return prisma.creativeLibrary.delete({ where: { id } });
  },

  async listWinners(type?: string, limit = 100) {
    return prisma.creativeLibrary.findMany({
      where: {
        isWinner: true,
        ...(type !== undefined && { type: type as any }),
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },

  async listByType(type: string, limit = 100) {
    return prisma.creativeLibrary.findMany({
      where: { type: type as any },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
  },
};
