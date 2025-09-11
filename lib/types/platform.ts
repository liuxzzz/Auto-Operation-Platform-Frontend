// 平台枚举类型
export enum Platform {
  KUAISHOU = "kuaishou",
  DOUYIN = "douyin",
  WEIXIN_VIDEO = "weixin_video",
  XIAOHONGSHU = "xiaohongshu",
}

// 平台相关类型
export interface PlatformOption {
  value: Platform;
  label: string;
}

// 账号信息类型
export interface Account {
  id: string;
  name: string;
  platform: Platform;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
}
