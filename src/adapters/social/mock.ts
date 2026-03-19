import type { SocialAdapter, PublishResult, SocialMetrics } from "./types";

export const mockSocialAdapter: SocialAdapter = {
  async publish(options) {
    const id = Math.random().toString(36).slice(2, 11);
    console.log("[MockSocial] publish called, platform:", options.platform, "account:", options.accountHandle);
    const result: PublishResult = {
      postId: `mock-post-${id}`,
      publishedUrl: `https://${options.platform.toLowerCase()}.com/@${options.accountHandle}/posts/${id}`,
      status: "published",
    };
    return result;
  },

  async getMetrics(postId) {
    console.log("[MockSocial] getMetrics called, postId:", postId);
    const metrics: SocialMetrics = {
      views: Math.floor(Math.random() * 45000) + 5000,
      likes: Math.floor(Math.random() * 3000) + 200,
      shares: Math.floor(Math.random() * 800) + 50,
      comments: Math.floor(Math.random() * 400) + 20,
      saves: Math.floor(Math.random() * 1200) + 100,
      clicks: Math.floor(Math.random() * 1500) + 80,
    };
    return metrics;
  },
};
