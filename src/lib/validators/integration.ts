import { z } from "zod";

export const createIntegrationSchema = z.object({
  name: z.string().min(1),
  provider: z.enum([
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
  ]),
  apiKeyEncrypted: z.string().min(1),
  baseUrl: z.string().url().optional().nullable(),
  isEnabled: z.boolean().optional(),
});

export const updateIntegrationSchema = createIntegrationSchema
  .omit({ provider: true })
  .partial();

export type CreateIntegrationInput = z.infer<typeof createIntegrationSchema>;
export type UpdateIntegrationInput = z.infer<typeof updateIntegrationSchema>;
