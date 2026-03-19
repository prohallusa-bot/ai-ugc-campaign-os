import type { VideoAdapter, VideoRenderResult, VideoRenderOptions } from "./types";

export const mockVideoAdapter: VideoAdapter = {
  async render(options) {
    const id = Math.random().toString(36).slice(2, 9);
    console.log("[MockVideo] render called, avatarId:", options.avatarId, "format:", options.outputFormat);
    const ext = options.outputFormat === "IMAGE" ? "jpg" : "mp4";
    const result: VideoRenderResult = {
      jobId: `mock-video-${id}`,
      outputUrl: `https://mock-storage.local/video/${id}.${ext}`,
      outputFormat: options.outputFormat,
      status: "complete",
      width: options.width,
      height: options.height,
    };
    return result;
  },

  async renderImage(options) {
    console.log("[MockVideo] renderImage called, avatarId:", options.avatarId);
    return mockVideoAdapter.render({
      ...options,
      audioUrl: options.audioUrl ?? "",
      outputFormat: "IMAGE",
    });
  },

  async getStatus(jobId) {
    console.log("[MockVideo] getStatus called, jobId:", jobId);
    const id = jobId.replace("mock-video-", "");
    return {
      jobId,
      outputUrl: `https://mock-storage.local/video/${id}.mp4`,
      outputFormat: "VIDEO" as const,
      status: "complete",
      width: 1080,
      height: 1920,
    };
  },
};
