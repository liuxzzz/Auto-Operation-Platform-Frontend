import { useCallback, useEffect, useState } from "react";

import { userService } from "@/lib/services";

export function useUserInteractions(userId: string = "default_user") {
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // 加载用户交互数据
  const loadUserInteractions = useCallback(async () => {
    if (initialized) return; // 防止重复加载

    try {
      setLoading(true);

      const [likes, collections] = await Promise.all([
        userService.getUserLikes(userId),
        userService.getUserCollections(userId),
      ]);

      setLikedItems(new Set(likes));
      setCollectedItems(new Set(collections));
      setInitialized(true);
    } catch (error) {
      console.error("Error loading user interactions:", error);
    } finally {
      setLoading(false);
    }
  }, [userId, initialized]);

  // 处理点赞
  const handleLike = useCallback(
    async (noteId: string) => {
      const isLiked = likedItems.has(noteId);
      const action = isLiked ? "unlike" : "like";

      try {
        const success = await userService.updateUserLikes(
          userId,
          noteId,
          action
        );

        if (success) {
          setLikedItems(prev => {
            const newSet = new Set(prev);
            if (isLiked) {
              newSet.delete(noteId);
            } else {
              newSet.add(noteId);
            }
            return newSet;
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating like:", error);
        return false;
      }
    },
    [userId, likedItems]
  );

  // 处理收藏
  const handleCollect = useCallback(
    async (noteId: string) => {
      const isCollected = collectedItems.has(noteId);
      const action = isCollected ? "uncollect" : "collect";

      try {
        const success = await userService.updateUserCollections(
          userId,
          noteId,
          action
        );

        if (success) {
          setCollectedItems(prev => {
            const newSet = new Set(prev);
            if (isCollected) {
              newSet.delete(noteId);
            } else {
              newSet.add(noteId);
            }
            return newSet;
          });
          return true;
        }
        return false;
      } catch (error) {
        console.error("Error updating collection:", error);
        return false;
      }
    },
    [userId, collectedItems]
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
