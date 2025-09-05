import {
  ApiResponse,
  CreateContentRequest,
  PaginationParams,
  UserAction,
} from "@/types/api";
import { ContentItem } from "@/types/content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// 通用 API 请求函数
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}/api${endpoint}`;

  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetch(url, { ...defaultOptions, ...options });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

// 内容相关 API
export const contentApi = {
  // 获取内容列表
  getContent: (params: PaginationParams = {}) => {
    const searchParams = new URLSearchParams();
    if (params.page) searchParams.set("page", params.page.toString());
    if (params.limit) searchParams.set("limit", params.limit.toString());
    if (params.category) searchParams.set("category", params.category);

    return apiRequest<ContentItem[]>(`/content?${searchParams.toString()}`);
  },

  // 获取单个内容
  getContentById: (id: string) => {
    return apiRequest<ContentItem>(`/content/${id}`);
  },

  // 创建内容
  createContent: (data: CreateContentRequest) => {
    return apiRequest<ContentItem>("/content", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 更新内容
  updateContent: (id: string, data: Partial<CreateContentRequest>) => {
    return apiRequest<ContentItem>(`/content/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  // 删除内容
  deleteContent: (id: string) => {
    return apiRequest<ContentItem>(`/content/${id}`, {
      method: "DELETE",
    });
  },
};

// 用户相关 API
export const userApi = {
  // 获取用户点赞列表
  getUserLikes: (userId: string) => {
    return apiRequest<string[]>(`/user/likes?userId=${userId}`);
  },

  // 更新用户点赞
  updateUserLikes: (data: UserAction) => {
    return apiRequest(`/user/likes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  // 获取用户收藏列表
  getUserCollections: (userId: string) => {
    return apiRequest<string[]>(`/user/collections?userId=${userId}`);
  },

  // 更新用户收藏
  updateUserCollections: (data: UserAction) => {
    return apiRequest(`/user/collections`, {
      method: "POST",
      body: JSON.stringify(data),
    });
  },
};

// 导出默认的 API 对象
export default {
  content: contentApi,
  user: userApi,
};
