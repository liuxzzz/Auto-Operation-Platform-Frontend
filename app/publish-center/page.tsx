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
import { uploadFile } from "@/api/publish";
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
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
  const [publishMode, setPublishMode] = useState<"immediate" | "scheduled">(
    "immediate"
  ); // 发布模式

  // 图片上传相关状态
  const [uploadedImages, setUploadedImages] = useState<string[]>([]); // 已上传的图片URL列表
  const [uploadingImages, setUploadingImages] = useState<boolean[]>([]); // 上传状态
  const [dragOver, setDragOver] = useState(false); // 拖拽状态

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

  // 当平台改变时，重置账号选择并过滤账号列表
  useEffect(() => {
    if (selectedPlatform) {
      setSelectedAccount(""); // 重置账号选择
    }
  }, [selectedPlatform]);

  // 过滤出支持当前选择平台的账号
  const filteredAccounts = selectedPlatform
    ? accounts.filter(account => account.platform === selectedPlatform)
    : accounts;

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

  const verifyForm = (): { isValid: boolean; message?: string } => {
    // 验证标题
    if (!title.trim()) {
      return { isValid: false, message: "请输入内容标题" };
    }
    // 验证发布平台
    if (!selectedPlatform) {
      return { isValid: false, message: "请选择发布平台" };
    }

    // 验证发布账号
    if (!selectedAccount) {
      return { isValid: false, message: "请选择发布账号" };
    }

    // 验证定时发布的时间
    if (publishMode === "scheduled") {
      if (!releaseTime) {
        return { isValid: false, message: "请选择发布时间" };
      }

      // 验证发布时间不能是过去的时间
      const now = new Date();
      if (releaseTime <= now) {
        return { isValid: false, message: "发布时间必须是未来的时间" };
      }
    }

    return { isValid: true };
  };

  const handleSubmit = () => {
    // 执行表单验证
    const validation = verifyForm();
    if (!validation.isValid) {
      toast("提交失败", {
        description: validation.message,
      });
      return;
    }

    // 获取选中的账号信息
    const selectedAccountData = accounts.find(
      account => account.id === selectedAccount
    );
    if (!selectedAccountData) {
      toast("提交失败", {
        description: "账号信息获取失败，请重新选择",
      });
      return;
    }

    // 准备提交数据
    const _submitData = {
      title: title.trim(),
      description: description.trim(),
      platform: selectedPlatform,
      account: {
        id: selectedAccount,
        name: selectedAccountData.account_name,
        platform: selectedAccountData.platform,
      },
      publishMode,
      releaseTime: publishMode === "scheduled" ? releaseTime : undefined,
      images: uploadedImages, // 包含上传的图片URL列表
    };

    // console.log("提交数据:", _submitData);
    // TODO: 调用API提交数据
    // console.log("提交数据:", submitData);

    toast("提交成功", {
      description:
        publishMode === "immediate" ? "内容已发布" : "内容已安排定时发布",
    });

    // 提交成功后可以跳转或重置表单
    // router.push("/publish-center");
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

  // 图片上传相关函数
  const handleFileUpload = async (files: FileList) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // 验证文件类型
      if (!file.type.startsWith("image/")) {
        toast("文件类型错误", {
          description: `${file.name} 不是有效的图片文件`,
        });
        return false;
      }
      // 文件大小验证已取消
      return true;
    });

    if (validFiles.length === 0) return;

    // 限制最多上传18张图片
    if (uploadedImages.length + validFiles.length > 18) {
      toast("图片数量超限", {
        description: "最多只能上传18张图片",
      });
      return;
    }

    // 为每个文件添加上传状态
    const newUploadingStates = new Array(validFiles.length).fill(true);
    setUploadingImages(prev => [...prev, ...newUploadingStates]);

    // 并行上传所有文件
    const uploadPromises = validFiles.map(async (file, _index) => {
      try {
        const result = await uploadFile(file);

        if (result.code === 0 && result.data?.object_key) {
          return result.data.file_url;
        } else {
          throw new Error(result.message || "上传失败");
        }
      } catch (error) {
        // console.error("上传失败:", error);
        toast("上传失败", {
          description: `${file.name} 上传失败: ${error instanceof Error ? error.message : "未知错误"}`,
        });
        return null;
      }
    });

    // 等待所有上传完成
    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter(url => url !== null) as string[];

    // 更新状态
    setUploadedImages(prev => [...prev, ...successfulUploads]);
    setUploadingImages(prev => prev.slice(0, -validFiles.length));

    if (successfulUploads.length > 0) {
      toast("上传成功", {
        description: `成功上传 ${successfulUploads.length} 张图片`,
      });
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
    // 清空input值，允许重复选择同一文件
    event.target.value = "";
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);

    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragOver(false);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
    toast("图片已删除");
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
                {/* 1. 上传图片部分 */}
                <div>
                  <Label className="block text-sm font-medium mb-2">
                    图片上传
                    <span className="text-gray-500 ml-2">
                      ({uploadedImages.length}/18)
                    </span>
                  </Label>
                  {/* 上传区域 */}
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                      dragOver
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onClick={() =>
                      document.getElementById("file-input")?.click()
                    }
                  >
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600">
                      点击上传图片或拖拽图片到此处
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      支持 JPG、PNG 格式，最多18张
                    </p>
                  </div>

                  {/* 图片预览区域 */}
                  {(uploadedImages.length > 0 ||
                    uploadingImages.some(Boolean)) && (
                    <div className="mt-6">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-sm font-medium text-gray-900">
                          已上传图片
                        </h3>
                        <span className="text-xs text-gray-500">
                          {uploadedImages.length} 张图片
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {/* 已上传的图片 */}
                        {uploadedImages.map((imageUrl, index) => (
                          <div key={index} className="relative group">
                            <div className="aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                              <img
                                src={imageUrl}
                                alt={`上传的图片 ${index + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                              />
                            </div>
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                removeImage(index);
                              }}
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-all duration-200 opacity-0 group-hover:opacity-100 shadow-lg"
                              title="删除图片"
                            >
                              ×
                            </button>
                          </div>
                        ))}

                        {/* 上传中的图片占位符 */}
                        {uploadingImages
                          .map((isUploading, index) =>
                            isUploading ? (
                              <div
                                key={`uploading-${index}`}
                                className="relative"
                              >
                                <div className="aspect-square rounded-lg border-2 border-dashed border-blue-300 bg-blue-50 flex flex-col items-center justify-center">
                                  <Spinner
                                    size="md"
                                    className="mb-3 text-blue-500"
                                  />
                                  <p className="text-xs text-blue-600 font-medium">
                                    上传中...
                                  </p>
                                </div>
                              </div>
                            ) : null
                          )
                          .filter(Boolean)}
                      </div>

                      {/* 图片操作提示 */}
                      {uploadedImages.length > 0 && (
                        <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <p className="text-xs text-blue-700">
                            💡 提示：悬停图片可查看详情，点击右上角 × 可删除图片
                          </p>
                        </div>
                      )}
                    </div>
                  )}
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
                    disabled={
                      accountsLoading ||
                      !selectedPlatform ||
                      filteredAccounts.length === 0
                    }
                  >
                    <SelectTrigger className="w-full">
                      <div className="flex items-center">
                        <User className="mr-2 h-4 w-4 text-gray-500" />
                        <SelectValue
                          placeholder={
                            accountsLoading
                              ? "加载中..."
                              : !selectedPlatform
                                ? "请先选择发布平台"
                                : filteredAccounts.length === 0
                                  ? "该平台暂无可用账号"
                                  : "请选择发布账号..."
                          }
                        />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {filteredAccounts.length > 0 ? (
                        filteredAccounts.map(account => (
                          <SelectItem key={account.id} value={account.id}>
                            {account.account_name}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1.5 text-sm text-gray-500">
                          {selectedPlatform
                            ? "该平台暂无可用账号"
                            : "请先选择发布平台"}
                        </div>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">
                    选择要发布内容的账号
                  </p>
                </div>

                {/* 发布模式和时间选择 */}
                <div className="space-y-4">
                  {/* 发布模式选择 */}
                  <div>
                    <Label className="text-sm font-medium mb-3 block">
                      发布时间 <span className="text-red-500">*</span>
                    </Label>
                    <RadioGroup
                      value={publishMode}
                      onValueChange={(value: "immediate" | "scheduled") =>
                        setPublishMode(value)
                      }
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="immediate" id="immediate" />
                        <Label
                          htmlFor="immediate"
                          className="text-sm font-normal cursor-pointer flex items-center"
                        >
                          立即发布
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="scheduled" id="scheduled" />
                        <Label
                          htmlFor="scheduled"
                          className="text-sm font-normal cursor-pointer flex items-center"
                        >
                          定时发布
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* 条件显示时间选择器 */}
                  {publishMode === "scheduled" && (
                    <div className="ml-6 pl-4 border-l-2 border-blue-100">
                      <Label
                        htmlFor="date"
                        className="mb-2 block text-sm font-medium"
                      >
                        选择发布时间
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
                            <CalendarIcon className="mr-2 h-4 w-4" />
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
                      <p className="text-xs text-gray-500 mt-1">
                        选择内容发布的具体时间
                      </p>
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
                      !title.trim() || !selectedPlatform || !selectedAccount
                    }
                    className="px-8 cursor-pointer"
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
