import { useCallback, useEffect, useState } from "react";

import { favoriteArticle, getUserFavorites } from "@/api/articles";

export function useUserInteractions(_userId: string = "default_user") {
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // 从服务器加载用户交互数据
  const loadUserInteractions = useCallback(async () => {
    if (initialized) return; // 防止重复加载

    try {
      setLoading(true);

      // 从服务器获取收藏数据
      let collections: string[] = [];
      try {
        const { articles } = await getUserFavorites();
        collections = articles.map((item: any) => item.note_id) || [];
      } catch {
        // 服务器请求失败时，保持空数组，不使用localStorage
        collections = [];
      }

      setCollectedItems(new Set(collections));

      setInitialized(true);
    } catch {
      // 加载用户交互数据失败
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // 处理收藏（使用真实网络接口）
  const handleCollect = useCallback(
    async (noteId: string, isCollected: boolean) => {
      try {
        // 调用真实的收藏接口
        await favoriteArticle(noteId, isCollected);

        // 更新本地状态
        setCollectedItems(prev => {
          const newSet = new Set(prev);
          if (isCollected) {
            newSet.add(noteId);
          } else {
            newSet.delete(noteId);
          }
          return newSet;
        });
        // 更新
        return true;
      } catch {
        // 更新收藏状态失败
        return false;
      }
    },
    []
  );

  // 检查是否已收藏
  const isCollected = useCallback(
    (noteId: string) => {
      return collectedItems.has(noteId);
    },
    [collectedItems]
  );

  // 初始化加载 - 只在组件挂载时执行一次
  useEffect(() => {
    loadUserInteractions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    collectedItems,
    loading,
    handleCollect,
    isCollected,
    loadUserInteractions,
  };
}
