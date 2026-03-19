import { z } from "zod";

export const createAccountSchema = z.object({
  platform: z.enum([
    "TIKTOK",
    "INSTAGRAM_REELS",
    "YOUTUBE_SHORTS",
    "FACEBOOK_REELS",
  ]),
  handle: z.string().min(1),
  tier: z.enum(["SEED", "GROWTH", "SCALE"]).optional(),
  warmthDay: z.number().int().min(0).optional(),
  dailyPostTarget: z.number().int().positive().optional(),
  healthStatus: z
    .enum(["HEALTHY", "WARNING", "RESTRICTED", "BANNED"])
    .optional(),
});

export const updateAccountSchema = createAccountSchema
  .omit({ platform: true, handle: true })
  .partial();

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
