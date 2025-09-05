import { API_ENDPOINTS } from "@/lib/constants/api";
import {
  DataResponse,
  PaginatedResponse,
  QueryParams,
} from "@/lib/types/common";
import { buildQueryString, del, get, post, put } from "@/lib/utils/http";
import { ContentItem } from "@/types/content";

import { BaseService } from "./BaseService";

// 内容服务类
export class ContentService extends BaseService {
  private static instance: ContentService;

  private constructor() {
    super();
  }

  public static getInstance(): ContentService {
    if (!ContentService.instance) {
      ContentService.instance = new ContentService();
    }
    return ContentService.instance;
  }

  // 获取内容列表
  async getContent(
    params: QueryParams & { category?: string } = {}
  ): Promise<ContentItem[]> {
    try {
      const queryString = buildQueryString(params);
      const endpoint = queryString
        ? `${API_ENDPOINTS.CONTENT.LIST}?${queryString}`
        : API_ENDPOINTS.CONTENT.LIST;

      const response = await get<PaginatedResponse<ContentItem>>(endpoint);
      return this.handlePaginatedResponse(response).then(result => result.data);
    } catch (error) {
      console.error("Error fetching content:", error);
      // 回退到本地数据
      return this.getLocalContent();
    }
  }

  // 获取单个内容
  async getContentById(id: string): Promise<ContentItem | null> {
    try {
      const response = await get<DataResponse<ContentItem>>(
        API_ENDPOINTS.CONTENT.DETAIL(id)
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error fetching content by id:", error);
      return null;
    }
  }

  // 创建内容
  async createContent(data: Partial<ContentItem>): Promise<ContentItem | null> {
    try {
      const response = await post<DataResponse<ContentItem>>(
        API_ENDPOINTS.CONTENT.CREATE,
        data
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error creating content:", error);
      return null;
    }
  }

  // 更新内容
  async updateContent(
    id: string,
    data: Partial<ContentItem>
  ): Promise<ContentItem | null> {
    try {
      const response = await put<DataResponse<ContentItem>>(
        API_ENDPOINTS.CONTENT.UPDATE(id),
        data
      );
      return this.handleResponse(response);
    } catch (error) {
      console.error("Error updating content:", error);
      return null;
    }
  }

  // 删除内容
  async deleteContent(id: string): Promise<boolean> {
    try {
      const response = await del<DataResponse<ContentItem>>(
        API_ENDPOINTS.CONTENT.DELETE(id)
      );
      return response.success;
    } catch (error) {
      console.error("Error deleting content:", error);
      return false;
    }
  }

  // 回退到本地数据
  private async getLocalContent(): Promise<ContentItem[]> {
    try {
      const dataFiles = [
        "/data/search_contents_2025-09-04-舒服干净穿搭.json",
        "/data/search_contents_2025-09-04-早秋的穿搭.json",
        "/data/search_contents_2025-09-04-卫衣.json",
      ];

      const promises = dataFiles.map(async file => {
        const response = await fetch(file);
        if (!response.ok) {
          throw new Error(`Failed to load ${file}`);
        }
        return response.json();
      });

      const results = await Promise.all(promises);
      const combinedData = results.flat();

      // 去重（基于note_id）
      const uniqueData = combinedData.filter(
        (item, index, self) =>
          index === self.findIndex(t => t.note_id === item.note_id)
      );

      return uniqueData;
    } catch (error) {
      console.error("Error loading local content:", error);
      return [];
    }
  }
}

// 导出单例实例
export const contentService = ContentService.getInstance();
