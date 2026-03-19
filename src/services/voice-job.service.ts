import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";
import type { PaginationParams } from "@/types/api";

export const voiceJobService = {
  async list(params?: PaginationParams) {
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 20;
    const [data, total] = await Promise.all([
      prisma.voiceJob.findMany({
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: { createdAt: "desc" },
      }),
      prisma.voiceJob.count(),
    ]);
    return { data, total, page, pageSize, hasMore: page * pageSize < total };
  },

  async getById(id: string) {
    const item = await prisma.voiceJob.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("VoiceJob", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.voiceJob.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.voiceJob.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.voiceJob.delete({ where: { id } });
  },

  async listByVariation(variationId: string) {
    return prisma.voiceJob.findMany({
      where: { variationId },
      orderBy: { createdAt: "desc" },
    });
  },

  async updateStatus(
    id: string,
    status: string,
    urls?: { sourceAudioUrl?: string; finalAudioUrl?: string }
  ) {
    await this.getById(id);
    return prisma.voiceJob.update({
      where: { id },
      data: {
        status: status as any,
        ...(urls?.sourceAudioUrl !== undefined && { sourceAudioUrl: urls.sourceAudioUrl }),
        ...(urls?.finalAudioUrl !== undefined && { finalAudioUrl: urls.finalAudioUrl }),
      },
    });
  },
};
