import { useCallback, useEffect, useState } from "react";

import { getArticles, getArticleTags } from "@/api/articles";
import { ContentItem } from "@/lib/types";

// 后端返回的分页数据接口
interface BackendPaginationData {
  page: number;
  page_size: number;
  total: number;
  pages: number;
}

// 内部使用的分页数据接口
interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

// 分类数据接口
interface CategoryData {
  keyword: string;
  count: number;
}

// 分类响应数据接口
interface CategoriesResponse {
  categories: CategoryData[];
  total_categories: number;
  total_articles: number;
}

// 转换后端分页数据为内部格式
const convertPaginationData = (
  backendData: BackendPaginationData
): PaginationData => {
  return {
    currentPage: backendData.page,
    totalPages: backendData.pages,
    totalItems: backendData.total,
    itemsPerPage: backendData.page_size,
    hasNextPage: backendData.page < backendData.pages,
    hasPrevPage: backendData.page > 1,
  };
};

export function useContent() {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);
  const [pagination, setPagination] = useState<PaginationData>(
    convertPaginationData({
      page: 1,
      pages: 1,
      total: 0,
      page_size: 12,
    })
  );
  const [currentCategory, setCurrentCategory] = useState<string>("全部");
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // 加载内容数据（支持分页）
  const loadContent = useCallback(
    async (page: number = 1, category: string = "全部") => {
      try {
        setLoading(true);
        setError(null);

        // 调用真实 API 获取文章数据
        const { articles, pagination: paginationInfo } = await getArticles(
          page,
          12,
          category
        );

        // 如果 API 返回的数据结构与 ContentItem 不完全匹配，可能需要数据转换
        const contentItems: ContentItem[] = Array.isArray(articles)
          ? articles
          : [];

        // 更新内容数据
        setFilteredContent(contentItems);

        // 更新分页信息
        if (paginationInfo) {
          // 如果后端返回的是新格式，进行转换
          if ("page" in paginationInfo && "pages" in paginationInfo) {
            setPagination(
              convertPaginationData(paginationInfo as BackendPaginationData)
            );
          } else {
            // 兼容旧格式
            const legacyData = paginationInfo as Record<string, unknown>;
            setPagination({
              currentPage: (legacyData.currentPage as number) || page,
              totalPages: (legacyData.totalPages as number) || 1,
              totalItems:
                (legacyData.totalItems as number) || contentItems.length,
              itemsPerPage: (legacyData.itemsPerPage as number) || 12,
              hasNextPage: (legacyData.hasNextPage as boolean) || false,
              hasPrevPage: (legacyData.hasPrevPage as boolean) || false,
            });
          }
        }

        // 如果是第一次加载或者是"全部"分类，也更新 allContent
        if (!initialized || category === "全部") {
          setAllContent(contentItems);
          setInitialized(true);
        }

        setCurrentCategory(category);
      } catch (err) {
        // 记录错误信息用于调试
        if (process.env.NODE_ENV === "development") {
          console.error("加载文章数据失败:", err);
        }
        setError(
          err instanceof Error ? err.message : "加载数据失败，请稍后重试"
        );

        // 在 API 失败时，设置空数组
        setFilteredContent([]);
        setPagination(
          convertPaginationData({
            page: 1,
            pages: 1,
            total: 0,
            page_size: 12,
          })
        );

        if (!initialized) {
          setAllContent([]);
          setInitialized(true);
        }
      } finally {
        setLoading(false);
      }
    },
    [initialized]
  );

  // 按分类筛选内容（使用服务端分页）
  const filterByCategory = useCallback(
    async (category: string) => {
      await loadContent(1, category);
    },
    [loadContent]
  );

  // 切换页码
  const changePage = useCallback(
    async (page: number) => {
      await loadContent(page, currentCategory);
    },
    [loadContent, currentCategory]
  );

  // 加载分类数据
  const loadCategories = useCallback(async () => {
    try {
      setCategoriesLoading(true);
      const categoriesData: CategoriesResponse = await getArticleTags();

      if (categoriesData && categoriesData.categories) {
        setCategories(categoriesData.categories);
      }
    } catch (err) {
      if (process.env.NODE_ENV === "development") {
        console.error("加载分类数据失败:", err);
      }
      // 如果加载失败，保持空数组
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  }, []);

  // 获取所有分类（包含计数信息）
  const getCategories = useCallback(() => {
    // 计算"全部"分类的总数
    const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);

    const allCategories = [
      { keyword: "全部", count: totalCount },
      ...categories,
    ];
    return allCategories;
  }, [categories]);

  // 创建新内容（模拟）
  const createContent = useCallback(async (data: Partial<ContentItem>) => {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      const newContent: ContentItem = {
        note_id: `demo-${Date.now()}`,
        type: "image",
        title: data.title || "新内容",
        desc: data.desc || "这是新创建的内容",
        video_url: data.video_url || null,
        time: Date.now(),
        last_update_time: Date.now(),
        last_modify_ts: Date.now(),
        user_id: "current-user",
        nickname: "当前用户",
        avatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face",
        liked_count: "0",
        collected_count: "0",
        comment_count: "0",
        share_count: "0",
        ip_location: "本地",
        image_list:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=600&fit=crop",
        tag_list: "新内容",
        note_url: `#${Date.now()}`,
        source_keyword: data.source_keyword || "其他",
        xsec_token: `token-${Date.now()}`,
      };

      setAllContent(prev => [...prev, newContent]);
      setFilteredContent(prev => [...prev, newContent]);
      return newContent;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error creating content:", error);
      }
      return null;
    }
  }, []);

  // 更新内容（模拟）
  const updateContent = useCallback(
    async (id: string, data: Partial<ContentItem>) => {
      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 500));

        const updatedContent = allContent.find(item => item.note_id === id);
        if (updatedContent) {
          const newContent = {
            ...updatedContent,
            ...data,
            last_update_time: Date.now(),
          };
          setAllContent(prev =>
            prev.map(item => (item.note_id === id ? newContent : item))
          );
          setFilteredContent(prev =>
            prev.map(item => (item.note_id === id ? newContent : item))
          );
          return newContent;
        }
        return null;
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.error("Error updating content:", error);
        }
        return null;
      }
    },
    [allContent]
  );

  // 删除内容（模拟）
  const deleteContent = useCallback(async (id: string) => {
    try {
      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 500));

      setAllContent(prev => prev.filter(item => item.note_id !== id));
      setFilteredContent(prev => prev.filter(item => item.note_id !== id));
      return true;
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Error deleting content:", error);
      }
      return false;
    }
  }, []);

  // 初始化加载 - 只在组件挂载时执行一次
  useEffect(() => {
    if (!initialized) {
      // 同时加载内容数据和分类数据
      Promise.all([loadContent(1, "全部"), loadCategories()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    allContent,
    filteredContent,
    loading,
    error,
    pagination,
    currentCategory,
    categories,
    categoriesLoading,
    loadContent,
    loadCategories,
    filterByCategory,
    changePage,
    getCategories,
    createContent,
    updateContent,
    deleteContent,
  };
}
