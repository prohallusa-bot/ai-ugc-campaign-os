import { z } from "zod";

export const updateGlobalSettingsSchema = z.object({
  workspaceName: z.string().optional(),
  brandName: z.string().optional(),
  timezone: z.string().optional(),
  currency: z.string().max(3).optional(),
  defaultVideoGoalPerWeek: z.number().int().positive().optional(),
  defaultPostGoalPerAccount: z.number().int().positive().optional(),
  defaultTargetCtr: z.number().min(0).max(1).optional(),
  defaultTargetConversionRate: z.number().min(0).max(1).optional(),
  defaultTargetCac: z.number().positive().optional(),
  defaultAov: z.number().positive().optional(),
  defaultLtv: z.number().positive().optional(),
  beginnerMode: z.boolean().optional(),
  advancedMode: z.boolean().optional(),
});

export type UpdateGlobalSettingsInput = z.infer<typeof updateGlobalSettingsSchema>;
