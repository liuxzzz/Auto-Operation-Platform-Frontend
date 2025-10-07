export interface publishContentRequest {
  title: string;
  description: string;
  platform: string;
  account: string;
  publishMode: string;
  releaseTime?: string;
  images: string[];
}
