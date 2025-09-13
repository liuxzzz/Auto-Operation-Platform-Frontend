"use client";

import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Globe,
  Sparkles,
  Upload,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getAccounts } from "@/api/account";
import { generateContent } from "@/api/ai";
import { getArticleById } from "@/api/articles";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loading } from "@/components/ui/loading";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Account, ContentItem, Platform, PlatformOption } from "@/lib/types";

export default function ContentDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const contentId = searchParams.get("id");
  const isEditMode = !!contentId; // 判断是否为编辑模式

  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(isEditMode); // 只有在编辑模式下才需要加载
  const [error, setError] = useState<string | null>(null);
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  // 表单状态
  const [title, setTitle] = useState("");
  const [expression, setExpression] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedModel, setSelectedModel] = useState("deepseek");
  const [selectedAccount, setSelectedAccount] = useState<string>("");
  const [selectedPlatform, setSelectedPlatform] = useState<Platform | "">("");
  const [releaseTime, setReleaseTime] = useState<Date | undefined>(undefined);
  const [isScheduled, setIsScheduled] = useState(false); // false = 立即发布, true = 定时发布

  // 获取账号列表
  const fetchAccounts = async () => {
    try {
      setAccountsLoading(true);
      const res = await getAccounts();
      const { data } = res;
      if (data && data.accounts) {
        setAccounts(data.accounts);
      } else {
        setAccounts([]);
      }
    } catch {
      toast("获取账号列表失败", {
        description: "请稍后重试",
      });
      setAccounts([]);
    } finally {
      setAccountsLoading(false);
    }
  };

  // 从API获取内容数据 - 只在编辑模式下执行
  useEffect(() => {
    const fetchContent = async () => {
      if (!isEditMode || !contentId) return;

      try {
        setLoading(true);
        setError(null);

        const data = await getArticleById(contentId);
        setContent(data);

        // 初始化表单数据
        setTitle(data.title || "");
        setDescription(data.desc || "");
      } catch {
        setError("获取内容失败，请稍后重试");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentId, isEditMode]);

  // 获取账号列表
  useEffect(() => {
    fetchAccounts();
  }, []);

  // 只在编辑模式下显示加载和错误状态
  if (isEditMode && loading) {
    return <Loading message="正在加载内容..." />;
  }

  if (isEditMode && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">😵</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              返回
            </Button>
            <Button onClick={() => window.location.reload()}>重试</Button>
          </div>
        </div>
      </div>
    );
  }

  if (isEditMode && !content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-gray-400 text-6xl mb-4">📄</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">内容未找到</h3>
          <p className="text-gray-600 mb-4">该内容可能已被删除或不存在</p>
          <Button onClick={() => router.back()}>返回</Button>
        </div>
      </div>
    );
  }

  const handleSubmit = () => {
    // TODO: 实现提交逻辑
    // 提交内容: { title, expression, description, platform: selectedPlatform }
  };

  const handleSaveDraft = () => {
    toast("功能暂未开发", {
      description: "存草稿功能正在开发中，敬请期待",
    });
  };

  const modelOptions = [
    { value: "openai", label: "GPT" },
    { value: "deepseek", label: "DeepSeek" },
  ];

  const platformOptions: PlatformOption[] = [
    { value: Platform.XIAOHONGSHU, label: "小红书" },
    { value: Platform.DOUYIN, label: "抖音" },
    { value: Platform.KUAISHOU, label: "快手" },
    { value: Platform.WEIXIN_VIDEO, label: "微信视频号" },
  ];

  const handleAIGenerate = async () => {
    // 检查必要的输入
    if (!expression.trim() && !description.trim()) {
      alert("请先输入你的表达或内容描述");
      return;
    }

    setIsGenerating(true);

    try {
      // 模拟AI生成过程
      const result = await generateContent({
        model: selectedModel,
        content: {
          expression,
          title,
        },
      });

      // 基于用户输入生成模板内容
      const generatedContent = result.text;

      setDescription(generatedContent);
    } catch {
      toast("AI生成失败", {
        description: "请稍后重试",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(description);
    toast("复制成功");
  };

  const handleAddTag = (tag: string) => {
    const newDescription = description + (description ? "\n" : "") + tag;
    setDescription(newDescription);
    toast("标签已添加");
  };

  const tagList = ["#小红书市集秋上新[话题]#", "#秋天的第一套新衣[话题]#"];

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
            <h1 className="text-xl font-semibold text-gray-900">
              {isEditMode ? "编辑内容" : "创建内容"}
            </h1>
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
                  <Label className="block text-sm font-medium  mb-2">
                    图片上传
                  </Label>
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
                  <Label className="block text-sm font-medium  mb-2">
                    标题 <span className="text-red-500">*</span>
                  </Label>
                  <Input
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
                  <Label className="block text-sm font-medium  mb-2">
                    你的表达
                  </Label>
                  <Input
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
                    <Label className="block text-sm font-medium ">
                      内容描述 <span className="text-red-500">*</span>
                    </Label>

                    <div className="w-full flex-1 flex items-center gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-[36px]"
                        onClick={handleCopy}
                      >
                        一键复制
                      </Button>
                      <Select
                        value={selectedModel}
                        onValueChange={setSelectedModel}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="选择生成方式" />
                        </SelectTrigger>
                        <SelectContent>
                          {modelOptions.map(model => (
                            <SelectItem key={model.value} value={model.value}>
                              {model.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                        className="h-[36px]"
                      >
                        <Sparkles
                          size={14}
                          className={isGenerating ? "animate-spin" : ""}
                        />
                        <span>{isGenerating ? "生成中..." : "AI一键生成"}</span>
                      </Button>
                    </div>
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

                  {/* Tag列表区域 */}
                  <div className="mt-4">
                    <Label className="block text-sm font-medium  mb-2">
                      热门标签
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {tagList.map((tag, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddTag(tag)}
                          className="text-xs px-3 py-1 h-auto bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300"
                        >
                          {tag}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      点击标签可添加到内容描述中
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 第二部分：发布设置 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">
                发布设置
              </h2>

              <div className="grid gap-6 max-w-[250px]">
                {/* 选择平台 */}
                <div>
                  <Label className="block text-sm font-medium  mb-2">
                    发布平台 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedPlatform}
                    onValueChange={value =>
                      setSelectedPlatform(value as Platform)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <Globe className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue placeholder="请选择发布平台..." />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {platformOptions.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    选择要发布到的平台
                  </p>
                </div>

                {/* 选择账号 */}
                <div>
                  <Label className="block text-sm font-medium  mb-2">
                    发布账号 <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={selectedAccount}
                    onValueChange={setSelectedAccount}
                    disabled={accountsLoading}
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue
                          placeholder={
                            accountsLoading ? "加载中..." : "请选择发布账号..."
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {accounts.map(account => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.account_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    选择要发布内容的账号
                  </p>
                </div>

                {/* 发布模式和时间选择 */}
                <div className="space-y-4">
                  {/* 发布模式选择 */}
                  <div className="flex flex-col">
                    <Label className="text-sm font-medium  mb-2">
                      发布模式 <span className="text-red-500">*</span>
                    </Label>
                    <div className="flex items-center ">
                      <p className="text-xs text-gray-500 mr-2">
                        {isScheduled ? "定时发布" : "立即发布"}
                      </p>
                      <Switch
                        checked={isScheduled}
                        onCheckedChange={setIsScheduled}
                      />
                    </div>
                  </div>

                  {/* 条件显示时间选择器 */}
                  {isScheduled && (
                    <div>
                      <Label htmlFor="date" className="mb-2">
                        发布时间
                      </Label>
                      <Popover
                        open={datePickerOpen}
                        onOpenChange={setDatePickerOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            data-empty={!releaseTime}
                            className="data-[empty=true]:text-muted-foreground w-[280px] justify-start text-left font-normal"
                          >
                            <CalendarIcon />
                            {releaseTime ? (
                              format(releaseTime, "PPP")
                            ) : (
                              <span>选择发布时间</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={releaseTime}
                            captionLayout="dropdown"
                            onSelect={date => {
                              setReleaseTime(date);
                              setDatePickerOpen(false);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>

              {/* 确认按钮 */}
              <div className="flex justify-end pt-6 border-t border-gray-200 mt-6">
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => router.back()}>
                    取消
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="px-6"
                  >
                    存草稿
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={
                      !title.trim() ||
                      !description.trim() ||
                      !selectedPlatform ||
                      !selectedAccount
                    }
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
