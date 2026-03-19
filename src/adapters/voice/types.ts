export interface VoiceSynthesisOptions {
  text: string;
  voiceId: string;
  speed?: number;
  pitch?: number;
}

export interface VoiceSynthesisResult {
  jobId: string;
  audioUrl?: string;
  status: "queued" | "processing" | "complete" | "failed";
}

export interface VoiceAdapter {
  synthesize(options: VoiceSynthesisOptions): Promise<VoiceSynthesisResult>;
  getStatus(jobId: string): Promise<VoiceSynthesisResult>;
  listVoices(): Promise<Array<{ id: string; name: string; preview?: string }>>;
}
