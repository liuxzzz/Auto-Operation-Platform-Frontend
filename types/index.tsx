export interface publishContentRequest {
  title: string;
  description: string;
  platform: string;
  account: string;
  publishMode: string;
  releaseTime?: string;
  images: string[];
}

export interface DraftItem {
  id: string;
  title: string;
  description: string;
  expression?: string;
  platform: string;
  account: string;
  publishMode: string;
  releaseTime?: string;
  releaseTimeValue?: string;
  images: string[];
  uploadedImageOnLocal: string[];
  createdAt: string;
  updatedAt: string;
}
