import { API_ENDPOINTS } from "@/lib/constants/api";
import { DataResponse } from "@/lib/types/common";
import { get, post } from "@/lib/utils/http";

import { BaseService } from "./BaseService";

// 用户服务类
export class UserService extends BaseService {
  private static instance: UserService;

  private constructor() {
    super();
  }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  // 获取用户点赞列表
  async getUserLikes(userId: string): Promise<string[]> {
    try {
      const response = await get<DataResponse<string[]>>(
        `${API_ENDPOINTS.USER.LIKES}?userId=${userId}`
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching user likes:", error);
      return [];
    }
  }

  // 更新用户点赞
  async updateUserLikes(
    userId: string,
    noteId: string,
    action: "like" | "unlike"
  ): Promise<boolean> {
    try {
      const response = await post<DataResponse<any>>(API_ENDPOINTS.USER.LIKES, {
        userId,
        noteId,
        action,
      });
      return response.success;
    } catch (error) {
      console.error("Error updating user likes:", error);
      return false;
    }
  }

  // 获取用户收藏列表
  async getUserCollections(userId: string): Promise<string[]> {
    try {
      const response = await get<DataResponse<string[]>>(
        `${API_ENDPOINTS.USER.COLLECTIONS}?userId=${userId}`
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching user collections:", error);
      return [];
    }
  }

  // 更新用户收藏
  async updateUserCollections(
    userId: string,
    noteId: string,
    action: "collect" | "uncollect"
  ): Promise<boolean> {
    try {
      const response = await post<DataResponse<any>>(
        API_ENDPOINTS.USER.COLLECTIONS,
        {
          userId,
          noteId,
          action,
        }
      );
      return response.success;
    } catch (error) {
      console.error("Error updating user collections:", error);
      return false;
    }
  }
}

// 导出单例实例
export const userService = UserService.getInstance();
