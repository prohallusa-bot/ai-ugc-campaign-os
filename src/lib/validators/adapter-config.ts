import { z } from "zod";

const integrationProviderEnum = z.enum([
  "OPENAI",
  "ANTHROPIC",
  "ELEVENLABS",
  "HEYGEN",
  "SYNTHESIA",
  "SUPABASE",
  "AWS_S3",
  "TIKTOK",
  "INSTAGRAM",
  "YOUTUBE",
  "FACEBOOK",
]);

export const updateAdapterConfigSchema = z.object({
  aiProvider: integrationProviderEnum.nullable().optional(),
  voiceProvider: integrationProviderEnum.nullable().optional(),
  videoProvider: integrationProviderEnum.nullable().optional(),
  storageProvider: integrationProviderEnum.nullable().optional(),
  socialTiktokProvider: integrationProviderEnum.nullable().optional(),
  socialInstagramProvider: integrationProviderEnum.nullable().optional(),
  socialYoutubeProvider: integrationProviderEnum.nullable().optional(),
  socialFacebookProvider: integrationProviderEnum.nullable().optional(),
  fallbackToMock: z.boolean().optional(),
});

export type UpdateAdapterConfigInput = z.infer<typeof updateAdapterConfigSchema>;
