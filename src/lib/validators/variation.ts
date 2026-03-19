import { z } from "zod";

export const createVariationSchema = z.object({
  batchId: z.string().min(1),
  hookType: z.enum(["QUESTION", "BOLD_CLAIM", "STORY", "STATISTIC", "CONTROVERSY"]),
  avatarType: z.enum([
    "MALE_YOUNG",
    "MALE_MIDDLE",
    "FEMALE_YOUNG",
    "FEMALE_MIDDLE",
    "AI_GENERATED",
  ]),
  lengthType: z.enum(["SHORT_15", "MEDIUM_30", "LONG_60"]),
  deliveryRegister: z.enum(["CASUAL", "AUTHORITATIVE", "EMOTIONAL", "HUMOROUS"]),
  platform: z.enum([
    "TIKTOK",
    "INSTAGRAM_REELS",
    "YOUTUBE_SHORTS",
    "FACEBOOK_REELS",
  ]),
  outputFormat: z.enum(["VIDEO", "IMAGE"]).optional().default("VIDEO"),
  width: z.number().int().positive().optional().default(1080),
  height: z.number().int().positive().optional().default(1920),
});

export const updateVariationSchema = createVariationSchema
  .omit({ batchId: true })
  .partial();

export type CreateVariationInput = z.infer<typeof createVariationSchema>;
export type UpdateVariationInput = z.infer<typeof updateVariationSchema>;
