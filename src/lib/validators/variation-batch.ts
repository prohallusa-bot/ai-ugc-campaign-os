import { z } from "zod";

export const createVariationBatchSchema = z.object({
  scriptId: z.string().min(1),
  name: z.string().min(1).max(255),
  status: z
    .enum(["PENDING", "GENERATING", "COMPLETE", "FAILED"])
    .optional(),
});

export const updateVariationBatchSchema = createVariationBatchSchema
  .omit({ scriptId: true })
  .partial();

export type CreateVariationBatchInput = z.infer<typeof createVariationBatchSchema>;
export type UpdateVariationBatchInput = z.infer<typeof updateVariationBatchSchema>;
