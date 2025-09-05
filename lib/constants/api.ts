// API 相关常量
export const API_ENDPOINTS = {
  // 内容相关
  CONTENT: {
    LIST: "/api/content",
    DETAIL: (id: string) => `/api/content/${id}`,
    CREATE: "/api/content",
    UPDATE: (id: string) => `/api/content/${id}`,
    DELETE: (id: string) => `/api/content/${id}`,
  },

  // 用户相关
  USER: {
    LIKES: "/api/user/likes",
    COLLECTIONS: "/api/user/collections",
  },

  // 测试
  TEST: "/api/test",
} as const;

// API 配置
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
} as const;

// 请求头配置
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
} as const;
