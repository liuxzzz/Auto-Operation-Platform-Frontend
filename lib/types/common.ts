// 通用类型定义

// 基础响应类型
export interface BaseResponse {
  success: boolean;
  message?: string;
  timestamp?: string;
}

// 分页响应类型
export interface PaginationResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// 带分页的响应类型
export interface PaginatedResponse<T> extends BaseResponse {
  data: T[];
  pagination: PaginationResponse;
}

// 单条数据响应类型
export interface DataResponse<T> extends BaseResponse {
  data: T;
}

// 错误响应类型
export interface ErrorResponse extends BaseResponse {
  error: string;
  details?: any;
}

// 查询参数类型
export interface QueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: string;
  order?: "asc" | "desc";
}

// 状态类型
export type LoadingState = "idle" | "loading" | "success" | "error";

// 操作类型
export type ActionType = "create" | "read" | "update" | "delete";

// 用户操作类型
export type UserAction = "like" | "unlike" | "collect" | "uncollect";
