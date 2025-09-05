import { Bookmark, Heart } from "lucide-react";
import React from "react";

import { ContentCardProps } from "@/types/content";
import { getFirstImage } from "@/utils/imageUtils";

export default function ContentCard({
  content,
  onLike,
  onCollect,
  onCardClick,
  isLiked = false,
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
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden relative group cursor-pointer"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`查看 ${content.title} 的详情`}
    >
      {/* 收藏按钮 - 右上角 */}
      <button
        onClick={e => {
          e.stopPropagation();
          onCollect?.();
        }}
        className="absolute top-3 right-3 z-10 bg-white/80 hover:bg-white rounded-full p-2 transition-all duration-200 cursor-pointer"
      >
        <Bookmark
          size={16}
          className={`${
            isCollected ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
          } hover:text-yellow-400`}
        />
      </button>

      {/* 图片区域 */}
      <div className="relative w-full aspect-[4/3] overflow-hidden">
        <img
          src={getFirstImage(content.image_list)}
          alt={content.title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* 视频标识 */}
        {content.type === "video" && (
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
            视频
          </div>
        )}
      </div>

      {/* 内容区域 */}
      <div className="p-4 space-y-3">
        {/* 标题 */}
        <h3 className="font-medium text-gray-900 text-sm sm:text-base line-clamp-2 leading-tight">
          {content.title}
        </h3>

        {/* 描述文案 */}
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-2 leading-relaxed">
          {formatDescription(content.desc)}
        </p>

        {/* 用户信息和点赞 */}
        <div className="flex items-center justify-between">
          {/* 用户信息 */}
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <img
              src={content.avatar}
              alt={content.nickname}
              className="w-6 h-6 rounded-full flex-shrink-0"
            />
            <span className="text-gray-700 text-xs sm:text-sm font-medium truncate">
              {content.nickname}
            </span>
          </div>

          {/* 点赞信息 */}
          <button
            onClick={e => {
              e.stopPropagation();
              onLike?.();
            }}
            className="flex items-center space-x-1 text-gray-500 hover:text-red-500 transition-colors duration-200 flex-shrink-0"
          >
            <Heart
              size={14}
              className={`${isLiked ? "fill-red-500 text-red-500" : ""}`}
            />
            <span className="text-xs sm:text-sm">
              {formatCount(content.liked_count)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
