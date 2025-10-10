import { Bookmark, Heart } from "lucide-react";
import React from "react";

import { ContentCardProps } from "@/lib/types/content";

export default function ContentCard({
  content,
  onCollect,
  onCardClick,
  isCollected = false,
}: ContentCardProps) {
  const formatCount = (count: string) => {
    const num = parseInt(count);
    if (num >= 10000) {
      return `${(num / 10000).toFixed(1)}w`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return count;
  };

  const formatDescription = (desc: string) => {
    // 移除时间戳标记和话题标签，只保留主要内容
    return (
      desc
        .replace(/#\d{2}:\d{2}\[时刻\]#/g, "") // 移除时间戳
        .replace(/#[^#]*\[话题\]#/g, "") // 移除话题标签
        .replace(/\n+/g, " ") // 将换行符替换为空格
        .trim()
        .substring(0, 120) + (desc.length > 120 ? "..." : "")
    ); // 限制长度
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // 阻止事件冒泡，避免触发按钮点击
    e.stopPropagation();

    if (onCardClick) {
      onCardClick(content.note_url);
    } else {
      // 默认行为：在新标签页中打开小红书链接
      window.open(content.note_url, "_blank", "noopener,noreferrer");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (onCardClick) {
        onCardClick(content.note_url);
      } else {
        // 默认行为：在新标签页中打开小红书链接
        window.open(content.note_url, "_blank", "noopener,noreferrer");
      }
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative group cursor-pointer border border-gray-100 hover:border-gray-200"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`查看 ${content.title} 的详情`}
    >
      {/* 内容区域 */}
      <div className="p-5 space-y-4">
        {/* 顶部：标题和收藏按钮 */}
        <div className="flex items-start gap-3">
          <h3 className="flex-1 font-semibold text-gray-900 text-base sm:text-lg line-clamp-2 leading-snug">
            {content.title}
          </h3>

          {/* 收藏按钮 */}
          <button
            onClick={e => {
              e.stopPropagation();
              onCollect?.();
            }}
            className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            aria-label={isCollected ? "取消收藏" : "收藏"}
          >
            <Bookmark
              size={18}
              className={`${
                isCollected
                  ? "fill-yellow-500 text-yellow-500"
                  : "text-gray-400 hover:text-yellow-500"
              } transition-colors`}
            />
          </button>
        </div>

        {/* 描述文案 */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
          {formatDescription(content.desc)}
        </p>

        {/* 分隔线 */}
        <div className="border-t border-gray-100"></div>

        {/* 底部：用户信息和互动数据 */}
        <div className="flex items-center justify-between">
          {/* 用户信息 */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <img
              src={content.avatar}
              alt={content.nickname}
              className="w-8 h-8 rounded-full flex-shrink-0 ring-2 ring-gray-100"
            />
            <span className="text-gray-700 text-sm font-medium truncate">
              {content.nickname}
            </span>
          </div>

          {/* 互动数据 */}
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* 点赞数 */}
            <div className="flex items-center gap-1.5 text-gray-600 group-hover:text-red-500 transition-colors duration-200">
              <Heart size={16} className="flex-shrink-0" />
              <span className="text-sm font-medium">
                {formatCount(content.liked_count)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
