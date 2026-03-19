export interface PublishOptions {
  videoUrl: string;
  caption: string;
  platform: string;
  accountHandle: string;
}

export interface PublishResult {
  postId: string;
  publishedUrl: string;
  status: "published" | "failed";
}

export interface SocialMetrics {
  views: number;
  likes: number;
  shares: number;
  comments: number;
  saves: number;
  clicks: number;
}

export interface SocialAdapter {
  publish(options: PublishOptions): Promise<PublishResult>;
  getMetrics(postId: string): Promise<SocialMetrics>;
}
