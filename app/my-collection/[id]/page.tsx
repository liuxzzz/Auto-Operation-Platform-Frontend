"use client";

import { ArrowLeft, Calendar, Sparkles, Upload, Users } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { useContent } from "@/lib";
import { ContentItem } from "@/lib/types";

export default function ContentDetail() {
  const params = useParams();
  const router = useRouter();
  const contentId = params.id as string;

  const { allContent, loading: contentLoading } = useContent();
  const [content, setContent] = useState<ContentItem | null>(null);
  const [notFound, setNotFound] = useState(false);

  // 表单状态
  const [title, setTitle] = useState("");
  const [expression, setExpression] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // 查找当前内容
  useEffect(() => {
    if (!contentLoading && allContent.length > 0) {
      const foundContent = allContent.find(item => item.note_id === contentId);
      if (foundContent) {
        setContent(foundContent);
        // 初始化表单数据
        setTitle(foundContent.title);
        setDescription(foundContent.desc);
      } else {
        setNotFound(true);
      }
    }
  }, [allContent, contentId, contentLoading]);

  if (contentLoading) {
    return <Loading message="正在加载内容..." />;
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">😵</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">内容未找到</h3>
          <p className="text-gray-600 mb-4">该内容可能已被删除或不存在</p>
          <Button onClick={() => router.back()}>返回</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    // TODO: 实现提交逻辑
    console.log("提交内容:", { title, expression, description });
  };

  const handleAIGenerate = async () => {
    // 检查必要的输入
    if (!expression.trim() && !description.trim()) {
      alert("请先输入你的表达或内容描述");
      return;
    }

    setIsGenerating(true);

    try {
      // 模拟AI生成过程
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 基于用户输入生成模板内容
      let generatedContent = "";

      if (expression.trim()) {
        generatedContent = `✨ ${expression.trim()}\n\n`;
      }

      if (description.trim()) {
        generatedContent += `${description.trim()}\n\n`;
      }

      generatedContent += `这次的分享希望能给大家带来一些灵感！每个人都有自己独特的风格，找到适合自己的才是最重要的。\n\n期待和大家一起交流更多有趣的内容～ 💫`;

      // 将生成的内容填入描述框
      setDescription(generatedContent);
    } catch (error) {
      console.error("AI生成内容失败:", error);
      alert("AI生成功能暂时不可用，请稍后重试");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 头部导航 */}
      <div className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="mr-4"
            >
              <ArrowLeft size={16} className="mr-1" />
              返回
            </Button>
            <h1 className="text-xl font-semibold text-gray-900">编辑内容</h1>
          </div>
        </div>
      </div>

      {/* 内容区域 - 可滚动 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
          <div className="space-y-8">
            {/* 第一部分：编辑区域 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                内容编辑
              </h2>

              <div className="space-y-6">
                {/* 1. 上传图片部分 - 占位符 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    图片上传
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600">
                      点击上传图片或拖拽图片到此处
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      支持 JPG、PNG 格式，最大 10MB
                    </p>
                  </div>
                </div>

                {/* 2. Title输入框 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    标题 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="请输入内容标题..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    maxLength={100}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      标题将作为内容的主要展示信息
                    </p>
                    <span className="text-xs text-gray-400">
                      {title.length}/100
                    </span>
                  </div>
                </div>

                {/* 3. 你的表达输入框 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    你的表达
                  </label>
                  <input
                    type="text"
                    value={expression}
                    onChange={e => setExpression(e.target.value)}
                    placeholder="请输入你想表达的内容..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                    maxLength={200}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      简短描述你想要表达的核心内容
                    </p>
                    <span className="text-xs text-gray-400">
                      {expression.length}/200
                    </span>
                  </div>
                </div>

                {/* 4. 内容输入框 */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      内容描述 <span className="text-red-500">*</span>
                    </label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAIGenerate}
                      disabled={isGenerating}
                      className="flex items-center space-x-1 text-xs"
                    >
                      <Sparkles
                        size={14}
                        className={isGenerating ? "animate-spin" : ""}
                      />
                      <span>{isGenerating ? "生成中..." : "AI一键生成"}</span>
                    </Button>
                  </div>
                  <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="请输入详细的内容描述..."
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors resize-vertical"
                    maxLength={2000}
                  />
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500">
                      详细描述内容，支持换行
                    </p>
                    <span className="text-xs text-gray-400">
                      {description.length}/2000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 第二部分：发布设置 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                发布设置
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 选择账号 - 占位符 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    发布账号
                  </label>
                  <div className="relative">
                    <select
                      disabled
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    >
                      <option>请选择发布账号...</option>
                    </select>
                    <Users className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    选择要发布内容的账号
                  </p>
                </div>

                {/* 选择时间 - 占位符 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    发布时间
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      disabled
                      placeholder="选择发布时间..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    />
                    <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    可选择立即发布或定时发布
                  </p>
                </div>
              </div>

              {/* 确认按钮 */}
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => router.back()}>
                    取消
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!title.trim() || !description.trim()}
                    className="px-8"
                  >
                    保存并发布
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
