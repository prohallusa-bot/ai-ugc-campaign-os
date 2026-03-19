export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

export const PLATFORM_LABELS: Record<string, string> = {
  TIKTOK: "TikTok",
  INSTAGRAM_REELS: "Instagram Reels",
  YOUTUBE_SHORTS: "YouTube Shorts",
  FACEBOOK_REELS: "Facebook Reels",
};

export const ACCOUNT_TIER_LABELS: Record<string, string> = {
  SEED: "Seed",
  GROWTH: "Growth",
  SCALE: "Scale",
};

export const HOOK_TYPE_LABELS: Record<string, string> = {
  QUESTION: "Question",
  BOLD_CLAIM: "Bold Claim",
  STORY: "Story",
  STATISTIC: "Statistic",
  CONTROVERSY: "Controversy",
};

export const LENGTH_LABELS: Record<string, string> = {
  SHORT_15: "15s",
  MEDIUM_30: "30s",
  LONG_60: "60s",
};

export const DELIVERY_LABELS: Record<string, string> = {
  CASUAL: "Casual",
  AUTHORITATIVE: "Authoritative",
  EMOTIONAL: "Emotional",
  HUMOROUS: "Humorous",
};

export const ASPECT_RATIO_DIMENSIONS: Record<string, { width: number; height: number }> = {
  "9:16": { width: 1080, height: 1920 },
  "1:1": { width: 1080, height: 1080 },
  "16:9": { width: 1920, height: 1080 },
  "4:5": { width: 1080, height: 1350 },
};

export const OUTPUT_FORMAT_LABELS: Record<string, string> = {
  VIDEO: "Video",
  IMAGE: "Image",
};
