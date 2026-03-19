import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const personaService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.persona.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.persona.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.persona.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("Persona", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.persona.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.persona.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.persona.delete({ where: { id } });
  },

  async listByOffer(offerId: string, params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.persona.findMany({
        where: { offerId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.persona.count({ where: { offerId } }),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },
};
