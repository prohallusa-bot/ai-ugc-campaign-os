import type { VoiceAdapter, VoiceSynthesisResult } from "./types";

export const mockVoiceAdapter: VoiceAdapter = {
  async synthesize(options) {
    const id = Math.random().toString(36).slice(2, 9);
    console.log("[MockVoice] synthesize called, voiceId:", options.voiceId, "text length:", options.text.length);
    const result: VoiceSynthesisResult = {
      jobId: `mock-voice-${id}`,
      audioUrl: `https://mock-storage.local/voice/${id}.mp3`,
      status: "complete",
    };
    return result;
  },

  async getStatus(jobId) {
    console.log("[MockVoice] getStatus called, jobId:", jobId);
    const id = jobId.replace("mock-voice-", "");
    return {
      jobId,
      audioUrl: `https://mock-storage.local/voice/${id}.mp3`,
      status: "complete",
    };
  },

  async listVoices() {
    console.log("[MockVoice] listVoices called");
    return [
      { id: "voice-rachel", name: "Rachel", preview: "https://mock-storage.local/previews/rachel.mp3" },
      { id: "voice-josh", name: "Josh", preview: "https://mock-storage.local/previews/josh.mp3" },
      { id: "voice-elli", name: "Elli", preview: "https://mock-storage.local/previews/elli.mp3" },
    ];
  },
};
