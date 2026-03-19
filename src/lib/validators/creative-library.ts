import { z } from "zod";

export const createCreativeLibrarySchema = z.object({
  name: z.string().min(1),
  type: z.enum([
    "HOOK",
    "CTA",
    "AVATAR_REF",
    "VOICE_SAMPLE",
    "CONCEPT",
    "SCRIPT_TEMPLATE",
  ]),
  content: z.string().min(1),
  tags: z.array(z.string()).optional(),
  isWinner: z.boolean().optional(),
  sourceVariationId: z.string().nullable().optional(),
  performanceScore: z.number().nullable().optional(),
});

export const updateCreativeLibrarySchema = createCreativeLibrarySchema.partial();

export type CreateCreativeLibraryInput = z.infer<typeof createCreativeLibrarySchema>;
export type UpdateCreativeLibraryInput = z.infer<typeof updateCreativeLibrarySchema>;
