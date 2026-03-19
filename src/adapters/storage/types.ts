export interface UploadOptions {
  file: Buffer | Blob;
  path: string;
  contentType?: string;
}

export interface StorageAdapter {
  upload(options: UploadOptions): Promise<{ url: string; path: string }>;
  getSignedUrl(path: string, expiresIn?: number): Promise<string>;
  delete(path: string): Promise<void>;
}
