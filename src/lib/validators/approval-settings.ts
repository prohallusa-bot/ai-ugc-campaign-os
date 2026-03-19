import { z } from "zod";

export const updateApprovalSettingsSchema = z.object({
  personaApproval: z.boolean().optional(),
  scriptApproval: z.boolean().optional(),
  hookApproval: z.boolean().optional(),
  voiceApproval: z.boolean().optional(),
  videoApproval: z.boolean().optional(),
  scheduleApproval: z.boolean().optional(),
  weeklyBriefApproval: z.boolean().optional(),
  autoApproveLowRisk: z.boolean().optional(),
  confidenceThreshold: z.number().min(0).max(1).optional(),
});

export type UpdateApprovalSettingsInput = z.infer<typeof updateApprovalSettingsSchema>;
