import { mockAIAdapter } from "./ai/mock";
import { createAnthropicAIAdapter } from "./ai/anthropic";
import { mockVoiceAdapter } from "./voice/mock";
import { mockVideoAdapter } from "./video/mock";
import { mockStorageAdapter } from "./storage/mock";
import { mockSocialAdapter } from "./social/mock";
import type { AIAdapter } from "./ai/types";
import type { VoiceAdapter } from "./voice/types";
import type { VideoAdapter } from "./video/types";
import type { StorageAdapter } from "./storage/types";
import type { SocialAdapter } from "./social/types";

export type { AIAdapter, VoiceAdapter, VideoAdapter, StorageAdapter, SocialAdapter };

export function getAIAdapter(provider?: string | null, apiKey?: string): AIAdapter {
  const p = provider || process.env.AI_PROVIDER || "mock";
  if (p === "ANTHROPIC" || p === "anthropic") {
    return createAnthropicAIAdapter(apiKey);
  }
  return mockAIAdapter;
}

export function getVoiceAdapter(provider?: string | null): VoiceAdapter {
  // Future: switch on provider for real implementations
  return mockVoiceAdapter;
}

export function getVideoAdapter(provider?: string | null): VideoAdapter {
  return mockVideoAdapter;
}

export function getStorageAdapter(provider?: string | null): StorageAdapter {
  return mockStorageAdapter;
}

export function getSocialAdapter(provider?: string | null): SocialAdapter {
  return mockSocialAdapter;
}
