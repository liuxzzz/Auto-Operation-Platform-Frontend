// API 响应类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 分页查询参数
export interface PaginationParams {
  page?: number;
  limit?: number;
  category?: string;
}

// 用户操作类型
export interface UserAction {
  userId: string;
  noteId: string;
  action: "like" | "unlike" | "collect" | "uncollect";
}

// 内容创建类型
export interface CreateContentRequest {
  title: string;
  desc: string;
  type?: string;
  video_url?: string;
  user_id?: string;
  nickname?: string;
  avatar?: string;
  ip_location?: string;
  image_list?: string;
  tag_list?: string;
  note_url?: string;
  source_keyword?: string;
  xsec_token?: string;
}

// 内容更新类型
export interface UpdateContentRequest {
  title?: string;
  desc?: string;
  type?: string;
  video_url?: string;
  nickname?: string;
  avatar?: string;
  ip_location?: string;
  image_list?: string;
  tag_list?: string;
  source_keyword?: string;
}

// 用户信息类型
export interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

// 认证相关类型
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  nickname: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}
