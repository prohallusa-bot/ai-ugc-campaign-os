import type { StorageAdapter } from "./types";

export const mockStorageAdapter: StorageAdapter = {
  async upload(options) {
    console.log("[MockStorage] upload called, path:", options.path, "contentType:", options.contentType ?? "application/octet-stream");
    const url = `https://mock-storage.local/files/${options.path}`;
    return { url, path: options.path };
  },

  async getSignedUrl(path, expiresIn = 3600) {
    console.log("[MockStorage] getSignedUrl called, path:", path, "expiresIn:", expiresIn);
    const token = Math.random().toString(36).slice(2, 16);
    return `https://mock-storage.local/signed/${path}?token=${token}&expires=${Date.now() + expiresIn * 1000}`;
  },

  async delete(path) {
    console.log("[MockStorage] delete called, path:", path);
  },
};
