import { NextRequest, NextResponse } from "next/server";
import { apiHandler } from "@/lib/api-handler";
import { offerService, scriptService } from "@/services";
import { prisma } from "@/lib/prisma";

export const POST = apiHandler(async (_req, ctx) => {
  const { id } = await ctx.params;

  const offer = await offerService.getById(id);
  const personas = await prisma.persona.findMany({ where: { offerId: id } });

  const createdScripts = [];

  for (const persona of personas) {
    const hookText = `Did you know that ${persona.name} struggles with this exact problem?`;
    const painText = "The pain of not having a solution is real...";
    const mechanismText = "Here's how our product works...";
    const solutionText = "The solution is simple and effective...";
    const transformationText = "Imagine your life after using this...";
    const ctaText = "Click the link below to get started today!";
    const fullScript = [hookText, painText, mechanismText, solutionText, transformationText, ctaText].join("\n\n");

    const script = await scriptService.create({
      conceptName: `${offer.name} - ${persona.name} Script`,
      hookText,
      painText,
      mechanismText,
      solutionText,
      transformationText,
      ctaText,
      fullScript,
      durationSeconds: 30,
      offerId: offer.id,
      personaId: persona.id,
      status: "DRAFT",
    });

    createdScripts.push(script);
  }

  return NextResponse.json(
    { success: true, data: { scriptsCreated: createdScripts.length } },
    { status: 201 }
  );
});
