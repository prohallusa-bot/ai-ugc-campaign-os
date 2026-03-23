import Anthropic from "@anthropic-ai/sdk";

export interface ScriptGeneratorInput {
  offer: {
    name: string;
    aov: number;
    ltv: number;
    targetCac: number;
  };
  persona: {
    name: string;
    demographicJson: Record<string, unknown>;
    psychographicJson: Record<string, unknown>;
    painJson: Record<string, unknown>;
    transformationJson: Record<string, unknown>;
  };
  count?: number;
}

export interface GeneratedScript {
  conceptName: string;
  hookText: string;
  painText: string;
  mechanismText: string;
  solutionText: string;
  transformationText: string;
  ctaText: string;
  fullScript: string;
  durationSeconds: number;
}

function buildPrompt(input: ScriptGeneratorInput, count: number): string {
  const { offer, persona } = input;

  return `You are an expert UGC (User-Generated Content) script writer for direct-response advertising.

Generate ${count} unique UGC video scripts for the following offer and persona.

## Offer Details
- Product/Offer: ${offer.name}
- Average Order Value: $${offer.aov}
- Customer Lifetime Value: $${offer.ltv}
- Target Customer Acquisition Cost: $${offer.targetCac}

## Target Persona: ${persona.name}
- Demographics: ${JSON.stringify(persona.demographicJson)}
- Psychographics: ${JSON.stringify(persona.psychographicJson)}
- Pain Points: ${JSON.stringify(persona.painJson)}
- Desired Transformation: ${JSON.stringify(persona.transformationJson)}

## Script Structure
Each script MUST have these sections:
1. **Hook** - An attention-grabbing opening (first 3 seconds) that stops the scroll
2. **Pain** - Agitate the viewer's problem so they feel understood
3. **Mechanism** - Explain WHY the problem exists (the underlying cause)
4. **Solution** - Introduce the product as the answer, highlighting key features
5. **Transformation** - Paint the picture of life after using the product
6. **CTA** - A clear, urgent call to action

## Output Format
Return a JSON array with exactly ${count} objects. Each object must have:
- "conceptName": a short creative concept name (e.g., "Morning Struggle", "The Aha Moment")
- "hookText": the hook section text
- "painText": the pain section text
- "mechanismText": the mechanism section text
- "solutionText": the solution section text
- "transformationText": the transformation section text
- "ctaText": the CTA section text
- "fullScript": all sections combined as a natural spoken script
- "durationSeconds": estimated spoken duration in seconds (typically 30-60)

Return ONLY the JSON array, no other text.`;
}

function parseAIResponse(responseText: string): GeneratedScript[] {
  // Extract JSON array from the response, handling possible markdown code fences
  let jsonStr = responseText.trim();

  // Strip markdown code fences if present
  const fenceMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenceMatch) {
    jsonStr = fenceMatch[1].trim();
  }

  const parsed = JSON.parse(jsonStr);

  if (!Array.isArray(parsed)) {
    throw new Error("Expected AI response to be a JSON array");
  }

  return parsed.map((item: Record<string, unknown>) => ({
    conceptName: String(item.conceptName ?? "Untitled Concept"),
    hookText: String(item.hookText ?? ""),
    painText: String(item.painText ?? ""),
    mechanismText: String(item.mechanismText ?? ""),
    solutionText: String(item.solutionText ?? ""),
    transformationText: String(item.transformationText ?? ""),
    ctaText: String(item.ctaText ?? ""),
    fullScript: String(item.fullScript ?? ""),
    durationSeconds: Number(item.durationSeconds ?? 45),
  }));
}

function generateMockScripts(
  input: ScriptGeneratorInput,
  count: number,
): GeneratedScript[] {
  const { offer, persona } = input;

  const concepts = [
    {
      name: "The Wake-Up Call",
      hookStyle: "question",
      duration: 45,
    },
    {
      name: "Before & After",
      hookStyle: "story",
      duration: 55,
    },
    {
      name: "The Secret Nobody Talks About",
      hookStyle: "revelation",
      duration: 40,
    },
    {
      name: "I Wish I Knew Sooner",
      hookStyle: "regret",
      duration: 50,
    },
    {
      name: "Real Talk",
      hookStyle: "direct",
      duration: 35,
    },
  ];

  const painPoints = Object.values(persona.painJson).flat();
  const painSummary =
    painPoints.length > 0
      ? String(painPoints[0])
      : "struggling with this problem";

  const transformations = Object.values(persona.transformationJson).flat();
  const transformSummary =
    transformations.length > 0
      ? String(transformations[0])
      : "finally getting the results you deserve";

  return Array.from({ length: count }, (_, i) => {
    const concept = concepts[i % concepts.length];

    const hookText =
      concept.hookStyle === "question"
        ? `Are you tired of ${painSummary}? I was too, until I found ${offer.name}.`
        : concept.hookStyle === "story"
          ? `Six months ago, I was ${painSummary}. Today, everything is different.`
          : concept.hookStyle === "revelation"
            ? `Nobody talks about this, but the real reason you're ${painSummary} has nothing to do with what you think.`
            : concept.hookStyle === "regret"
              ? `I spent years ${painSummary}. I wish someone had told me about ${offer.name} sooner.`
              : `Let me be real with you. If you're ${painSummary}, you need to hear this.`;

    const painText = `I know exactly how it feels — ${painSummary}. You've probably tried everything. You've spent money on solutions that didn't work. And honestly? It's exhausting. You start to wonder if anything will ever actually help.`;

    const mechanismText = `Here's what I discovered: the real problem isn't what you think. Most solutions only treat the symptoms. They don't address the root cause. That's why nothing has worked long-term for you before.`;

    const solutionText = `That's exactly why ${offer.name} is different. It was designed to tackle the actual underlying issue. It's not just another quick fix — it's a complete approach that addresses what's really going on. And at just $${offer.aov}, it's a fraction of what I've wasted on things that didn't work.`;

    const transformationText = `Since I started using ${offer.name}, everything changed. I'm finally ${transformSummary}. I feel like a completely different person. My only regret is not finding it sooner.`;

    const ctaText = `If you're ready to stop ${painSummary} and start ${transformSummary}, tap the link below. Seriously, don't wait like I did. Your future self will thank you.`;

    const fullScript = [
      hookText,
      painText,
      mechanismText,
      solutionText,
      transformationText,
      ctaText,
    ].join("\n\n");

    return {
      conceptName: concept.name,
      hookText,
      painText,
      mechanismText,
      solutionText,
      transformationText,
      ctaText,
      fullScript,
      durationSeconds: concept.duration,
    };
  });
}

export async function generateScripts(
  input: ScriptGeneratorInput,
): Promise<GeneratedScript[]> {
  const count = input.count ?? 3;

  if (!process.env.ANTHROPIC_API_KEY) {
    return generateMockScripts(input, count);
  }

  try {
    const client = new Anthropic();
    const prompt = buildPrompt(input, count);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2000,
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = message.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text content in AI response");
    }

    return parseAIResponse(textBlock.text);
  } catch (error) {
    console.error("AI script generation failed, falling back to mock:", error);
    return generateMockScripts(input, count);
  }
}
