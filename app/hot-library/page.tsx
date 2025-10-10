"use client";

import { useState } from "react";

import { reportSearchResult } from "@/api/articles";
import ContentCard from "@/components/ContentCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loading } from "@/components/ui/loading";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useContent, useUserInteractions } from "@/lib";

export default function ContentPreview() {
  // 使用自定义 Hook 管理内容数据
  const {
    filteredContent,
    loading,
    error,
    pagination,
    currentCategory,
    filterByCategory,
    changePage,
    getCategories,
  } = useContent();

  // 使用自定义 Hook 管理用户交互
  const { handleCollect, isCollected } = useUserInteractions();

  // 输入框状态
  const [inputValue, setInputValue] = useState("");

  // 获取所有分类
  const categories = getCategories();

  // 处理输入框提交
  const handleSubmit = () => {
    console.log("输入的内容:", inputValue);
    reportSearchResult(inputValue);
    // 这里可以添加你需要的处理逻辑
    // 比如调用 API、搜索等
  };

  // 处理分类切换
  const handleCategoryChange = async (category: string) => {
    await filterByCategory(category);
  };

  // 处理页码变更
  const handlePageChange = async (page: number) => {
    await changePage(page);
    // 滚动到顶部
    window.scrollTo({ top: 0, behavior: "smooth" });
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
      <div className="h-full bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">内容预览</h1>

          {/* 输入框和按钮 */}
          <div className="mb-4">
            <div className="flex items-center gap-3 max-w-xl">
              <Input
                type="text"
                placeholder="输入爬虫关键词"
                value={inputValue}
                onChange={e => setInputValue(e.target.value)}
                className="flex-1"
                onKeyPress={e => {
                  if (e.key === "Enter") {
                    handleSubmit();
                  }
                }}
              />
              <Button onClick={handleSubmit} className="px-6">
                搜索
              </Button>
            </div>
          </div>

          {/* 分类筛选 */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Button
                key={category.keyword}
                onClick={() => handleCategoryChange(category.keyword)}
                className={`px-4 py-2 rounded-full text-sm font-medium   cursor-pointer transition-colors ${
                  currentCategory === category.keyword
                    ? "bg-[#1f1f1f] text-white hover:bg-[#1f1f1f]"
                    : "bg-gray-100 text-gray-700 hover:text-gray-700 hover:bg-gray-200  "
                }`}
              >
                {category.keyword}
                <span className="ml-1 text-xs opacity-75">
                  ({category.count})
                </span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-20">
          {/* 统计信息 */}
          <div className="mb-6 text-sm text-gray-600 flex justify-between items-center">
            <div>
              共 {pagination.totalItems} 个内容
              {currentCategory !== "全部" && ` · 分类: ${currentCategory}`}
              {pagination.totalPages > 1 && (
                <span className="ml-2">
                  · 第 {pagination.currentPage} 页，共 {pagination.totalPages}{" "}
                  页
                </span>
              )}
            </div>
            {pagination.totalPages > 1 && (
              <div className="text-xs text-gray-500">
                显示{" "}
                {(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-
                {Math.min(
                  pagination.currentPage * pagination.itemsPerPage,
                  pagination.totalItems
                )}{" "}
                项
              </div>
            )}
          </div>

          {/* 内容网格 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredContent.map(item => (
              <ContentCard
                key={item.note_id}
                content={item}
                isCollected={isCollected(item.note_id)}
                onCollect={() =>
                  handleCollect(item.note_id, !isCollected(item.note_id))
                }
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

          {/* 分页组件 */}
          {pagination.totalPages > 1 && (
            <div className="mt-8 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        handlePageChange(
                          Math.max(1, pagination.currentPage - 1)
                        )
                      }
                      className={
                        !pagination.hasPrevPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {/* 页码显示逻辑 */}
                  {(() => {
                    const pages = [];
                    const totalPages = pagination.totalPages;
                    const currentPage = pagination.currentPage;

                    if (totalPages <= 7) {
                      // 总页数少于等于7页，显示所有页码
                      for (let i = 1; i <= totalPages; i++) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => handlePageChange(i)}
                              isActive={currentPage === i}
                              className="cursor-pointer"
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }
                    } else {
                      // 总页数大于7页，使用省略号逻辑
                      pages.push(
                        <PaginationItem key={1}>
                          <PaginationLink
                            onClick={() => handlePageChange(1)}
                            isActive={currentPage === 1}
                            className="cursor-pointer"
                          >
                            1
                          </PaginationLink>
                        </PaginationItem>
                      );

                      if (currentPage > 3) {
                        pages.push(
                          <PaginationItem key="ellipsis1">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      const start = Math.max(2, currentPage - 1);
                      const end = Math.min(totalPages - 1, currentPage + 1);

                      for (let i = start; i <= end; i++) {
                        pages.push(
                          <PaginationItem key={i}>
                            <PaginationLink
                              onClick={() => handlePageChange(i)}
                              isActive={currentPage === i}
                              className="cursor-pointer"
                            >
                              {i}
                            </PaginationLink>
                          </PaginationItem>
                        );
                      }

                      if (currentPage < totalPages - 2) {
                        pages.push(
                          <PaginationItem key="ellipsis2">
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      }

                      pages.push(
                        <PaginationItem key={totalPages}>
                          <PaginationLink
                            onClick={() => handlePageChange(totalPages)}
                            isActive={currentPage === totalPages}
                            className="cursor-pointer"
                          >
                            {totalPages}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }

                    return pages;
                  })()}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        handlePageChange(
                          Math.min(
                            pagination.totalPages,
                            pagination.currentPage + 1
                          )
                        )
                      }
                      className={
                        !pagination.hasNextPage
                          ? "pointer-events-none opacity-50"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
