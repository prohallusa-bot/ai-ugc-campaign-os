import { z } from "zod";

export const updateCostControlSchema = z.object({
  dailySpendCap: z.number().positive().nullable().optional(),
  weeklySpendCap: z.number().positive().nullable().optional(),
  pauseOnThreshold: z.boolean().optional(),
  warnOnCacBreak: z.boolean().optional(),
  costPerScript: z.number().positive().nullable().optional(),
  costPerVoice: z.number().positive().nullable().optional(),
  costPerVideo: z.number().positive().nullable().optional(),
  costPerPost: z.number().positive().nullable().optional(),
});

export type UpdateCostControlInput = z.infer<typeof updateCostControlSchema>;
