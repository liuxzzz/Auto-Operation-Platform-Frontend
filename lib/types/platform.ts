// 平台枚举类型
export enum Platform {
  KUAISHOU = "快手",
  DOUYIN = "抖音",
  WEIXIN_VIDEO = "视频号",
  XIAOHONGSHU = "小红书",
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
