import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const scheduledPostService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.scheduledPost.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.scheduledPost.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.scheduledPost.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("ScheduledPost", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.scheduledPost.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.scheduledPost.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.scheduledPost.delete({ where: { id } });
  },

  async listByAccount(accountId: string, params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.scheduledPost.findMany({
        where: { accountId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.scheduledPost.count({ where: { accountId } }),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getUpcoming(limit = 10) {
    return prisma.scheduledPost.findMany({
      where: {
        scheduledTime: { gt: new Date() },
        status: "SCHEDULED" as any,
      },
      orderBy: { scheduledTime: "asc" },
      take: limit,
    });
  },

  async updateStatus(id: string, status: string, publishedUrl?: string) {
    await this.getById(id);
    return prisma.scheduledPost.update({
      where: { id },
      data: {
        status: status as any,
        ...(publishedUrl !== undefined && { publishedUrl }),
      },
    });
  },
};
