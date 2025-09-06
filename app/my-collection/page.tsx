"use client";

import { useRouter } from "next/navigation";
import { useMemo } from "react";

import ContentCard from "@/components/ContentCard";
import { Loading } from "@/components/ui/loading";
import { useContent, useUserInteractions } from "@/lib";

export default function ContentManage() {
  const router = useRouter();
  const { allContent, loading: contentLoading, error } = useContent();
  const {
    collectedItems,
    loading: interactionsLoading,
    handleLike,
    handleCollect,
    isLiked,
    isCollected,
  } = useUserInteractions();

  // 筛选已收藏的内容
  const collectedContent = useMemo(() => {
    return allContent.filter(content => collectedItems.has(content.note_id));
  }, [allContent, collectedItems]);

  // 处理卡片点击跳转
  const handleCardClick = (noteId: string) => {
    router.push(`/content-manage/${noteId}`);
  };

  const loading = contentLoading || interactionsLoading;

  if (loading) {
    return <Loading message="正在加载收藏内容..." />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">我的收藏</h1>
              <p className="text-gray-600 mt-1">
                共收藏了 {collectedContent.length} 个内容
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {collectedContent.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-4">📚</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              还没有收藏任何内容
            </h3>
            <p className="text-gray-600">去浏览内容并收藏你感兴趣的内容吧！</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {collectedContent.map(content => (
              <ContentCard
                key={content.note_id}
                content={content}
                onLike={() => handleLike(content.note_id)}
                onCollect={() => handleCollect(content.note_id)}
                onCardClick={() => handleCardClick(content.note_id)}
                isLiked={isLiked(content.note_id)}
                isCollected={isCollected(content.note_id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
