import { useCallback, useEffect, useState } from "react";

// 模拟用户交互数据 - 使用localStorage持久化
const STORAGE_KEYS = {
  likes: "demo_user_likes",
  collections: "demo_user_collections",
};

export function useUserInteractions(userId: string = "default_user") {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // 从localStorage加载用户交互数据
  const loadUserInteractions = useCallback(async () => {
    if (initialized) return; // 防止重复加载

    try {
      setLoading(true);

      // 模拟网络延迟
      await new Promise(resolve => setTimeout(resolve, 300));

      // 从localStorage读取数据
      const storedLikes = localStorage.getItem(STORAGE_KEYS.likes);
      const storedCollections = localStorage.getItem(STORAGE_KEYS.collections);

      const likes = storedLikes ? JSON.parse(storedLikes) : [];
      const collections = storedCollections
        ? JSON.parse(storedCollections)
        : ["demo-1"]; // 默认收藏第一个

      setLikedItems(new Set(likes));
      setCollectedItems(new Set(collections));
      setInitialized(true);
    } catch (error) {
      console.error("Error loading user interactions:", error);
    } finally {
      setLoading(false);
    }
  }, [initialized]);

  // 处理点赞（使用localStorage持久化）
  const handleLike = useCallback(
    async (noteId: string) => {
      const isLiked = likedItems.has(noteId);

      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 200));

        setLikedItems(prev => {
          const newSet = new Set(prev);
          if (isLiked) {
            newSet.delete(noteId);
          } else {
            newSet.add(noteId);
          }

          // 持久化到localStorage
          localStorage.setItem(STORAGE_KEYS.likes, JSON.stringify([...newSet]));
          return newSet;
        });
        return true;
      } catch (error) {
        console.error("Error updating like:", error);
        return false;
      }
    },
    [likedItems]
  );

  // 处理收藏（使用localStorage持久化）
  const handleCollect = useCallback(
    async (noteId: string) => {
      const isCollected = collectedItems.has(noteId);

      try {
        // 模拟网络延迟
        await new Promise(resolve => setTimeout(resolve, 200));

        setCollectedItems(prev => {
          const newSet = new Set(prev);
          if (isCollected) {
            newSet.delete(noteId);
          } else {
            newSet.add(noteId);
          }

          // 持久化到localStorage
          localStorage.setItem(
            STORAGE_KEYS.collections,
            JSON.stringify([...newSet])
          );
          return newSet;
        });
        return true;
      } catch (error) {
        console.error("Error updating collection:", error);
        return false;
      }
    },
    [collectedItems]
  );

  // 检查是否已点赞
  const isLiked = useCallback(
    (noteId: string) => {
      return likedItems.has(noteId);
    },
    [likedItems]
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
    likedItems,
    collectedItems,
    loading,
    handleLike,
    handleCollect,
    isLiked,
    isCollected,
    loadUserInteractions,
  };
}
