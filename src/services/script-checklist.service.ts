import { prisma } from "@/lib/prisma";
import { NotFoundError } from "@/lib/errors";

export const scriptChecklistService = {
  async list() {
    return prisma.scriptChecklist.findMany({
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    const item = await prisma.scriptChecklist.findUnique({ where: { id } });
    if (!item) throw new NotFoundError("ScriptChecklist", id);
    return item;
  },

  async create(input: Record<string, unknown>) {
    return prisma.scriptChecklist.create({ data: input as any });
  },

  async update(id: string, input: Record<string, unknown>) {
    await this.getById(id);
    return prisma.scriptChecklist.update({ where: { id }, data: input as any });
  },

  async delete(id: string) {
    await this.getById(id);
    return prisma.scriptChecklist.delete({ where: { id } });
  },

  async listByScript(scriptId: string) {
    return prisma.scriptChecklist.findMany({
      where: { scriptId },
      orderBy: { createdAt: "desc" },
    });
  },
};
