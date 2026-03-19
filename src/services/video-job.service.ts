import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const videoJobService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.videoJob.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.videoJob.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.videoJob.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("VideoJob", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.videoJob.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.videoJob.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.videoJob.delete({ where: { id } });
  },

  async listByVariation(variationId: string) {
    return prisma.videoJob.findMany({
      where: { variationId },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateStatus(id: string, status: string, videoUrl?: string) {
    await this.getById(id);
    return prisma.videoJob.update({
      where: { id },
      data: {
        status: status as any,
        ...(videoUrl !== undefined && { videoUrl }),
      },
    });
  },
};
