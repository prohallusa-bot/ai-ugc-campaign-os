import { z } from "zod";

export const updateProductionRuleSchema = z.object({
  videosPerWeek: z.number().int().positive().optional(),
  hookVariantsPerScript: z.number().int().positive().optional(),
  avatarVariantsPerHook: z.number().int().positive().optional(),
  lengthVariants: z.number().int().positive().optional(),
  deliveryVariants: z.number().int().positive().optional(),
  accountsActive: z.number().int().positive().optional(),
  postsPerAccount: z.number().int().positive().optional(),
  approvalRequired: z.boolean().optional(),
});

export type UpdateProductionRuleInput = z.infer<typeof updateProductionRuleSchema>;
