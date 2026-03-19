import { z } from "zod";

export const createScriptSchema = z.object({
  offerId: z.string().min(1),
  personaId: z.string().min(1),
  conceptName: z.string().min(1),
  hookText: z.string().min(1),
  painText: z.string().min(1),
  mechanismText: z.string().min(1),
  solutionText: z.string().min(1),
  transformationText: z.string().min(1),
  ctaText: z.string().min(1),
  fullScript: z.string().min(1),
  durationSeconds: z.number().int().positive(),
  status: z
    .enum(["DRAFT", "CHECKLIST_PENDING", "APPROVED", "REJECTED", "ARCHIVED"])
    .optional(),
});

export const updateScriptSchema = createScriptSchema
  .omit({ offerId: true, personaId: true })
  .partial();

export type CreateScriptInput = z.infer<typeof createScriptSchema>;
export type UpdateScriptInput = z.infer<typeof updateScriptSchema>;
