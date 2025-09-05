// 应用相关常量
export const APP_CONFIG = {
  NAME: "小红书内容制作、管理、分发平台",
  VERSION: "1.0.0",
  DESCRIPTION: "一个用于管理小红书内容的平台",
} as const;

// 分页配置
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
} as const;

// 用户配置
export const USER_CONFIG = {
  DEFAULT_USER_ID: "default_user",
  SESSION_TIMEOUT: 24 * 60 * 60 * 1000, // 24小时
} as const;

// 内容配置
export const CONTENT_CONFIG = {
  MAX_TITLE_LENGTH: 200,
  MAX_DESC_LENGTH: 1000,
  SUPPORTED_IMAGE_FORMATS: ["jpg", "jpeg", "png", "webp"],
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
} as const;
