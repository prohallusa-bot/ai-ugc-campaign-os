import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const scriptService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.script.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.script.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.script.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("Script", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.script.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    return prisma.script.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    return prisma.script.delete({ where: { id } });
  },

  async listByOffer(offerId: string, params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.script.findMany({
        where: { offerId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.script.count({ where: { offerId } }),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async listByPersona(personaId: string, params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.script.findMany({
        where: { personaId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.script.count({ where: { personaId } }),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async updateStatus(id: string, status: string) {
    return prisma.script.update({ where: { id }, data: { status: status as any } });
  },
};
