import Anthropic from "@anthropic-ai/sdk";
import type { AIAdapter, GenerateScriptOptions, GenerateScriptResult, ChecklistScoreResult } from "./types";

function createClient(apiKey?: string): Anthropic {
  return new Anthropic({ apiKey: apiKey || process.env.ANTHROPIC_API_KEY });
}

export function createAnthropicAIAdapter(apiKey?: string): AIAdapter {
  const client = createClient(apiKey);

  return {
    async generateScript(options: GenerateScriptOptions): Promise<GenerateScriptResult> {
      const systemPrompt = `You are an expert UGC (User Generated Content) script writer for social media ads. You write high-converting scripts that feel authentic and relatable. Always respond with valid JSON matching the exact structure requested.`;

      const userPrompt = `Write a UGC-style video script for a product called "${options.offerName}".

Target persona: ${options.personaName}
Main pain point: ${options.personaPain}
${options.hookType ? `Hook style: ${options.hookType}` : ""}
${options.lengthType ? `Target length: ${options.lengthType}` : ""}
${options.deliveryRegister ? `Delivery tone: ${options.deliveryRegister}` : ""}
${options.platform ? `Platform: ${options.platform}` : ""}
${options.promptTemplate ? `\nAdditional instructions:\n${options.promptTemplate}` : ""}

Respond with ONLY valid JSON in this exact format:
{
  "hookText": "opening hook line",
  "painText": "pain point section",
  "mechanismText": "mechanism/science explanation",
  "solutionText": "product solution section",
  "transformationText": "transformation/results section",
  "ctaText": "call to action",
  "durationSeconds": 45
}`;

      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: userPrompt }],
        system: systemPrompt,
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse AI response as JSON");

      const parsed = JSON.parse(jsonMatch[0]);
      return {
        hookText: parsed.hookText,
        painText: parsed.painText,
        mechanismText: parsed.mechanismText,
        solutionText: parsed.solutionText,
        transformationText: parsed.transformationText,
        ctaText: parsed.ctaText,
        fullScript: `${parsed.hookText}\n\n${parsed.painText}\n\n${parsed.mechanismText}\n\n${parsed.solutionText}\n\n${parsed.transformationText}\n\n${parsed.ctaText}`,
        durationSeconds: parsed.durationSeconds || 45,
      };
    },

    async scoreChecklist(script: string): Promise<ChecklistScoreResult> {
      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 512,
        system: "You are a UGC script quality analyst. Score scripts on a 0-100 scale. Respond with ONLY valid JSON.",
        messages: [{
          role: "user",
          content: `Score this UGC script:\n\n${script}\n\nCriteria: Hook strength (0-20), Pain resonance (0-20), Mechanism clarity (0-20), CTA effectiveness (0-20), Overall flow (0-20).\n\nRespond with ONLY: {"score": <number>, "notes": "<detailed feedback>"}`,
        }],
      });

      const text = message.content[0].type === "text" ? message.content[0].text : "";
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Failed to parse AI response");
      return JSON.parse(jsonMatch[0]);
    },

    async generateWeeklyReview(data: Record<string, unknown>): Promise<string> {
      const message = await client.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: "You are a performance analyst for UGC ad campaigns. Provide actionable weekly reviews in markdown format.",
        messages: [{
          role: "user",
          content: `Analyze this week's campaign performance data and provide a weekly review:\n\n${JSON.stringify(data, null, 2)}\n\nInclude: top performing patterns, weak patterns, and recommended actions for next week.`,
        }],
      });

      return message.content[0].type === "text" ? message.content[0].text : "";
    },
  };
}
