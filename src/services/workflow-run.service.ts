import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const workflowRunService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.workflowRun.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.workflowRun.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.workflowRun.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("WorkflowRun", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.workflowRun.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.workflowRun.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.workflowRun.delete({ where: { id } });
  },

  async updateProgress(id: string, videosCompleted: number) {
    await this.getById(id);
    return prisma.workflowRun.update({
      where: { id },
      data: { videosCompleted },
    });
  },
};
