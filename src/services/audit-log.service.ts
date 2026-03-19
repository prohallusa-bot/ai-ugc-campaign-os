import { prisma } from "@/lib/prisma";
import type { PaginationParams } from "@/types/api";

export const auditLogService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { timestamp: "desc" },
      }),
      prisma.auditLog.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async create(input: Record<string, unknown>) {
    return prisma.auditLog.create({ data: input as any });
  },

  async listByEntity(entityType: string, entityId: string, params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { entityType, entityId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { timestamp: "desc" },
      }),
      prisma.auditLog.count({ where: { entityType, entityId } }),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async listByUser(userId: string, params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.auditLog.findMany({
        where: { userId },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { timestamp: "desc" },
      }),
      prisma.auditLog.count({ where: { userId } }),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },
};
