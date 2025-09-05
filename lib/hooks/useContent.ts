import { useCallback, useEffect, useState } from "react";

import { contentService } from "@/lib/services";
import { ContentItem } from "@/lib/types";

export function useContent() {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // 加载内容数据
  const loadContent = useCallback(async () => {
    if (initialized) return; // 防止重复加载

    try {
      setLoading(true);
      setError(null);

      const data = await contentService.getContent({ limit: 100 });
      setAllContent(data);
      setFilteredContent(data);
      setInitialized(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "加载数据失败");
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // 按分类筛选内容
  const filterByCategory = useCallback(
    (category: string) => {
      if (category === "全部") {
        setFilteredContent(allContent);
      } else {
        const filtered = allContent.filter(
          item => item.source_keyword === category
        );
        setFilteredContent(filtered);
      }
    },
    [allContent]
  );

  // 获取所有分类
  const getCategories = useCallback(() => {
    const categories = [
      "全部",
      ...new Set(allContent.map(item => item.source_keyword)),
    ];
    return categories;
  }, [allContent]);

  // 创建新内容
  const createContent = useCallback(async (data: Partial<ContentItem>) => {
    try {
      const newContent = await contentService.createContent(data);
      if (newContent) {
        setAllContent(prev => [...prev, newContent]);
        setFilteredContent(prev => [...prev, newContent]);
        return newContent;
      }
      return null;
    } catch (error) {
      console.error("Error creating content:", error);
      return null;
    }
  }, []);

  // 更新内容
  const updateContent = useCallback(
    async (id: string, data: Partial<ContentItem>) => {
      try {
        const updatedContent = await contentService.updateContent(id, data);
        if (updatedContent) {
          setAllContent(prev =>
            prev.map(item => (item.note_id === id ? updatedContent : item))
          );
          setFilteredContent(prev =>
            prev.map(item => (item.note_id === id ? updatedContent : item))
          );
          return updatedContent;
        }
        return null;
      } catch (error) {
        console.error("Error updating content:", error);
        return null;
      }
    },
    []
  );

  // 删除内容
  const deleteContent = useCallback(async (id: string) => {
    try {
      const success = await contentService.deleteContent(id);
      if (success) {
        setAllContent(prev => prev.filter(item => item.note_id !== id));
        setFilteredContent(prev => prev.filter(item => item.note_id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting content:", error);
      return false;
    }
  }, []);

  // 初始化加载 - 只在组件挂载时执行一次
  useEffect(() => {
    loadContent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    allContent,
    filteredContent,
    loading,
    error,
    loadContent,
    filterByCategory,
    getCategories,
    createContent,
    updateContent,
    deleteContent,
  };
}
