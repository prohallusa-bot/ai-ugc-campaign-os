import { z } from "zod";

export const createPlatformRuleSchema = z.object({
  platform: z.enum([
    "TIKTOK",
    "INSTAGRAM_REELS",
    "YOUTUBE_SHORTS",
    "FACEBOOK_REELS",
  ]),
  defaultAspectRatio: z.string().optional(),
  captionStyle: z.string().optional(),
  maxDailyPosts: z.number().int().positive().optional(),
  warmUpRules: z.record(z.unknown()).optional(),
  namingConvention: z.string().nullable().optional(),
  isEnabled: z.boolean().optional(),
});

export const updatePlatformRuleSchema = createPlatformRuleSchema
  .omit({ platform: true })
  .partial();

export type CreatePlatformRuleInput = z.infer<typeof createPlatformRuleSchema>;
export type UpdatePlatformRuleInput = z.infer<typeof updatePlatformRuleSchema>;
