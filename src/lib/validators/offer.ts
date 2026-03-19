import { z } from "zod";

export const createOfferSchema = z.object({
  name: z.string().min(1).max(255),
  aov: z.number().positive(),
  ltv: z.number().positive(),
  targetCac: z.number().positive(),
  conversionRate: z.number().min(0).max(1),
  contentToClickRatio: z.number().min(0).max(1),
  revenueTarget: z.number().positive(),
});

export const updateOfferSchema = createOfferSchema.partial();

export type CreateOfferInput = z.infer<typeof createOfferSchema>;
export type UpdateOfferInput = z.infer<typeof updateOfferSchema>;
