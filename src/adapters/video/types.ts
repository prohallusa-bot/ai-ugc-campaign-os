export interface VideoRenderOptions {
  audioUrl: string;
  avatarId: string;
  outputFormat: "VIDEO" | "IMAGE";
  width: number;
  height: number;
  aspectRatio?: string;
  text?: string;
  captionStyle?: string;
}

export interface VideoRenderResult {
  jobId: string;
  outputUrl?: string;
  outputFormat: "VIDEO" | "IMAGE";
  status: "queued" | "processing" | "complete" | "failed";
  width: number;
  height: number;
}

export interface VideoAdapter {
  render(options: VideoRenderOptions): Promise<VideoRenderResult>;
  renderImage(options: Omit<VideoRenderOptions, "outputFormat" | "audioUrl"> & { audioUrl?: string }): Promise<VideoRenderResult>;
  getStatus(jobId: string): Promise<VideoRenderResult>;
}
