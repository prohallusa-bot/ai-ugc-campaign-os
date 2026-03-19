import { z } from "zod";

export const createPromptTemplateSchema = z.object({
  name: z.string().min(1),
  category: z.enum([
    "HOOK_GENERATION",
    "SCRIPT_WRITING",
    "PERSONA_RESEARCH",
    "CHECKLIST_SCORING",
    "WEEKLY_REVIEW",
    "OPTIMIZATION",
  ]),
  content: z.string().min(1),
  version: z.number().int().positive().optional(),
  isDefault: z.boolean().optional(),
});

export const updatePromptTemplateSchema = createPromptTemplateSchema.partial();

export type CreatePromptTemplateInput = z.infer<typeof createPromptTemplateSchema>;
export type UpdatePromptTemplateInput = z.infer<typeof updatePromptTemplateSchema>;
