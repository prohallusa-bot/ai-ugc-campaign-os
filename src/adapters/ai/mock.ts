import type { AIAdapter, GenerateScriptResult, ChecklistScoreResult } from "./types";

export const mockAIAdapter: AIAdapter = {
  async generateScript(options) {
    console.log("[MockAI] generateScript called with:", options.offerName);
    const result: GenerateScriptResult = {
      hookText: `Did you know most people struggle with ${options.personaPain}?`,
      painText: `${options.personaPain} affects millions of people every day. You've tried everything...`,
      mechanismText: "The science behind this is actually simple. Your body needs specific support that traditional solutions don't provide.",
      solutionText: `That's exactly what ${options.offerName} was designed for. Backed by clinical research.`,
      transformationText: "Within 2 weeks, users report dramatic improvements. Their confidence is back.",
      ctaText: "Tap the link in bio. Use code SAVE20 for 20% off your first order.",
      fullScript: "",
      durationSeconds: 45,
    };
    result.fullScript = `${result.hookText}\n\n${result.painText}\n\n${result.mechanismText}\n\n${result.solutionText}\n\n${result.transformationText}\n\n${result.ctaText}`;
    return result;
  },

  async scoreChecklist(script) {
    console.log("[MockAI] scoreChecklist called, script length:", script.length);
    return { score: Math.floor(Math.random() * 30) + 70, notes: "Mock score: Hook is strong. CTA could be more specific." };
  },

  async generateWeeklyReview(data) {
    console.log("[MockAI] generateWeeklyReview called");
    return "## Weekly Review (Mock)\n\n**Top patterns:** Question hooks outperform bold claims by 2x.\n**Weak patterns:** Long-form (60s) videos underperform on TikTok.\n**Actions:** Focus on 15s and 30s formats. Test more story-based hooks.";
  },
};
