export interface GenerateScriptResult {
  hookText: string;
  painText: string;
  mechanismText: string;
  solutionText: string;
  transformationText: string;
  ctaText: string;
  fullScript: string;
  durationSeconds: number;
}

export interface ChecklistScoreResult {
  score: number;
  notes: string;
}

export interface GenerateScriptOptions {
  personaName: string;
  personaPain: string;
  offerName: string;
  hookType?: string;
  lengthType?: string;
  deliveryRegister?: string;
  platform?: string;
  promptTemplate?: string;
}

export interface AIAdapter {
  generateScript(options: GenerateScriptOptions): Promise<GenerateScriptResult>;
  scoreChecklist(script: string): Promise<ChecklistScoreResult>;
  generateWeeklyReview(data: Record<string, unknown>): Promise<string>;
}
