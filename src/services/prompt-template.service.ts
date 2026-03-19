import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const promptTemplateService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.promptTemplate.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.promptTemplate.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.promptTemplate.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("PromptTemplate", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.promptTemplate.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.promptTemplate.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.promptTemplate.delete({ where: { id } });
  },

  async getDefault(category: string) {
    return prisma.promptTemplate.findFirst({
      where: { category: category as any, isDefault: true },
    });
  },

  async listByCategory(category: string) {
    return prisma.promptTemplate.findMany({
      where: { category: category as any },
      orderBy: { createdAt: "desc" },
    });
  },
};
