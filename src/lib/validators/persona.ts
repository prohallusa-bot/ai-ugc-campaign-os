import { z } from "zod";

export const createPersonaSchema = z.object({
  offerId: z.string().min(1),
  name: z.string().min(1).max(255),
  demographicJson: z.record(z.unknown()),
  psychographicJson: z.record(z.unknown()),
  painJson: z.record(z.unknown()),
  failedAlternativesJson: z.record(z.unknown()),
  transformationJson: z.record(z.unknown()),
  version: z.number().int().positive().optional(),
});

export const updatePersonaSchema = createPersonaSchema
  .omit({ offerId: true })
  .partial();

export type CreatePersonaInput = z.infer<typeof createPersonaSchema>;
export type UpdatePersonaInput = z.infer<typeof updatePersonaSchema>;
