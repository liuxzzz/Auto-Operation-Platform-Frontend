import {
  BaseResponse,
  DataResponse,
  PaginatedResponse,
} from "@/lib/types/common";
import { HttpError } from "@/lib/utils/http";

// 基础服务类
export abstract class BaseService {
  protected handleError(error: unknown): never {
    if (error instanceof HttpError) {
      throw error;
    }

    if (error instanceof Error) {
      throw new Error(`Service error: ${error.message}`);
    }

    throw new Error("Unknown service error");
  }

  protected async handleResponse<T>(
    response: BaseResponse | DataResponse<T> | PaginatedResponse<T>
  ): Promise<T> {
    if (!response.success) {
      throw new Error(response.message || "Request failed");
    }

    return (response as DataResponse<T>).data;
  }

  protected async handlePaginatedResponse<T>(
    response: PaginatedResponse<T>
  ): Promise<{ data: T[]; pagination: any }> {
    if (!response.success) {
      throw new Error(response.message || "Request failed");
    }

    return {
      data: response.data,
      pagination: response.pagination,
    };
  }
}
