"use client";

import { useEffect, useState } from "react";

import ContentCard from "@/components/ContentCard";
import { Loading } from "@/components/ui/loading";
import { ContentItem } from "@/types/content";

export default function ContentPreview() {
  const [allContent, setAllContent] = useState<ContentItem[]>([]);
  const [filteredContent, setFilteredContent] = useState<ContentItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("全部");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());
  const [collectedItems, setCollectedItems] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载JSON数据
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
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

        setAllContent(uniqueData);
        setFilteredContent(uniqueData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "加载数据失败");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 获取所有分类
  const categories = [
    "全部",
    ...new Set(allContent.map(item => item.source_keyword)),
  ];

  // 筛选内容
  useEffect(() => {
    if (selectedCategory === "全部") {
      setFilteredContent(allContent);
    } else {
      setFilteredContent(
        allContent.filter(item => item.source_keyword === selectedCategory)
      );
    }
  }, [selectedCategory, allContent]);

  // 处理点赞
  const handleLike = (noteId: string) => {
    setLikedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  // 处理收藏
  const handleCollect = (noteId: string) => {
    setCollectedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(noteId)) {
        newSet.delete(noteId);
      } else {
        newSet.add(noteId);
      }
      return newSet;
    });
  };

  // 处理卡片点击跳转
  const handleCardClick = (noteUrl: string) => {
    // 在新标签页中打开小红书链接
    window.open(noteUrl, "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return <Loading message="正在加载内容..." />;
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
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">内容预览</h1>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category}
                {category !== "全部" && (
                  <span className="ml-1 text-xs opacity-75">
                    (
                    {
                      allContent.filter(
                        item => item.source_keyword === category
                      ).length
                    }
                    )
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          {/* 统计信息 */}
          <div className="mb-6 text-sm text-gray-600">
            共 {filteredContent.length} 个内容
            {selectedCategory !== "全部" && ` · 分类: ${selectedCategory}`}
          </div>

          {/* 内容网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map(item => (
              <ContentCard
                key={item.note_id}
                content={item}
                isLiked={likedItems.has(item.note_id)}
                isCollected={collectedItems.has(item.note_id)}
                onLike={() => handleLike(item.note_id)}
                onCollect={() => handleCollect(item.note_id)}
                onCardClick={handleCardClick}
              />
            ))}
          </div>

          {/* 空状态 */}
          {filteredContent.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                暂无内容
              </h3>
              <p className="text-gray-600">该分类下暂时没有内容</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
