"use client";

import {
  Calendar,
  CheckCircle,
  Clock,
  Edit,
  Filter,
  Pause,
  Play,
  Plus,
  Search,
  Trash2,
  XCircle,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";

// 发布任务状态
type PublishStatus =
  | "pending"
  | "scheduled"
  | "publishing"
  | "published"
  | "failed";

// 模拟发布任务数据
const DEMO_TASKS = [
  {
    id: "task-1",
    title: "秋日穿搭分享 🍂",
    content:
      "今天想和大家分享一套超级温柔的秋日穿搭！这件卡其色风衣真的太好看了...",
    platform: "小红书",
    status: "published" as PublishStatus,
    scheduledTime: "2024-01-15 14:30",
    publishedTime: "2024-01-15 14:30",
    thumbnail:
      "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop",
    engagement: {
      views: "2.1k",
      likes: "856",
      comments: "89",
    },
  },
  {
    id: "task-2",
    title: "居家穿搭推荐 ✨",
    content: "分享一套超级舒服的居家穿搭！这件米色卫衣质感真的绝了...",
    platform: "抖音",
    status: "scheduled" as PublishStatus,
    scheduledTime: "2024-01-16 10:00",
    publishedTime: null,
    thumbnail:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=300&fit=crop",
    engagement: null,
  },
  {
    id: "task-3",
    title: "温暖卫衣搭配指南 🧡",
    content: "天气转凉了，卫衣绝对是秋冬必备单品！这件橘色卫衣颜色超级温暖...",
    platform: "微博",
    status: "publishing" as PublishStatus,
    scheduledTime: "2024-01-15 16:00",
    publishedTime: null,
    thumbnail:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=300&fit=crop",
    engagement: null,
  },
  {
    id: "task-4",
    title: "冬季保暖穿搭",
    content: "冬天到了，保暖是最重要的！今天分享几套既保暖又时尚的穿搭...",
    platform: "小红书",
    status: "failed" as PublishStatus,
    scheduledTime: "2024-01-15 12:00",
    publishedTime: null,
    thumbnail:
      "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop",
    engagement: null,
  },
];

const STATUS_CONFIG = {
  pending: { label: "待发布", color: "text-gray-600 bg-gray-100", icon: Clock },
  scheduled: {
    label: "已安排",
    color: "text-blue-600 bg-blue-100",
    icon: Calendar,
  },
  publishing: {
    label: "发布中",
    color: "text-yellow-600 bg-yellow-100",
    icon: Play,
  },
  published: {
    label: "已发布",
    color: "text-green-600 bg-green-100",
    icon: CheckCircle,
  },
  failed: {
    label: "发布失败",
    color: "text-red-600 bg-red-100",
    icon: XCircle,
  },
};

const PLATFORMS = [
  { value: "all", label: "全部平台" },
  { value: "小红书", label: "小红书" },
  { value: "抖音", label: "抖音" },
  { value: "微博", label: "微博" },
  { value: "知乎", label: "知乎" },
];

export default function PublishCenter() {
  const [tasks, setTasks] = useState(DEMO_TASKS);
  const [selectedStatus, setSelectedStatus] = useState<PublishStatus | "all">(
    "all"
  );
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // 筛选任务
  const filteredTasks = tasks.filter(task => {
    const matchesStatus =
      selectedStatus === "all" || task.status === selectedStatus;
    const matchesPlatform =
      selectedPlatform === "all" || task.platform === selectedPlatform;
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPlatform && matchesSearch;
  });

  // 获取状态统计
  const getStatusCount = (status: PublishStatus) => {
    return tasks.filter(task => task.status === status).length;
  };

  // 暂停/恢复任务
  const handleToggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task => {
        if (task.id === taskId) {
          if (task.status === "scheduled") {
            return { ...task, status: "pending" as PublishStatus };
          } else if (task.status === "pending") {
            return { ...task, status: "scheduled" as PublishStatus };
          }
        }
        return task;
      })
    );
  };

  // 删除任务
  const handleDeleteTask = (taskId: string) => {
    if (confirm("确定要删除这个发布任务吗？")) {
      setTasks(prev => prev.filter(task => task.id !== taskId));
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* 头部 */}
      <div className="bg-white shadow-sm flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">发布中心</h1>
              <p className="text-gray-600 mt-1">管理您的内容发布任务和进度</p>
            </div>
            <Button className="flex items-center space-x-2">
              <Plus size={16} />
              <span>新建发布任务</span>
            </Button>
          </div>
        </div>
      </div>

      {/* 统计卡片 */}
      <div className="bg-white border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {Object.entries(STATUS_CONFIG).map(([status, config]) => {
              const count = getStatusCount(status as PublishStatus);
              const IconComponent = config.icon;

              return (
                <div
                  key={status}
                  className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                    selectedStatus === status
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => setSelectedStatus(status as PublishStatus)}
                >
                  <div className="flex items-center space-x-2">
                    <IconComponent
                      size={16}
                      className={config.color.split(" ")[0]}
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {config.label}
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mt-1">
                    {count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 工具栏 */}
      <div className="bg-white border-b flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* 平台筛选 */}
              <select
                value={selectedPlatform}
                onChange={e => setSelectedPlatform(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                {PLATFORMS.map(platform => (
                  <option key={platform.value} value={platform.value}>
                    {platform.label}
                  </option>
                ))}
              </select>

              {/* 搜索框 */}
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="搜索发布任务..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedStatus("all")}
                className="flex items-center space-x-1"
              >
                <Filter size={14} />
                <span>全部状态</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📤</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? "未找到匹配的发布任务" : "还没有创建任何发布任务"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm
                  ? "尝试使用其他关键词搜索"
                  : "创建您的第一个发布任务"}
              </p>
              {!searchTerm && (
                <Button className="flex items-center space-x-2">
                  <Plus size={16} />
                  <span>新建发布任务</span>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map(task => {
                const statusConfig = STATUS_CONFIG[task.status];
                const StatusIcon = statusConfig.icon;

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex space-x-4 flex-1">
                          {/* 缩略图 */}
                          <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={task.thumbnail}
                              alt={task.title}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* 任务信息 */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center space-x-3">
                              <h3 className="text-lg font-medium text-gray-900">
                                {task.title}
                              </h3>
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                              >
                                <StatusIcon size={12} className="mr-1" />
                                {statusConfig.label}
                              </span>
                              <span className="inline-block px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                                {task.platform}
                              </span>
                            </div>

                            <p className="text-gray-600 text-sm line-clamp-2">
                              {task.content}
                            </p>

                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>预定时间: {task.scheduledTime}</span>
                              {task.publishedTime && (
                                <span>发布时间: {task.publishedTime}</span>
                              )}
                            </div>

                            {/* 数据统计 */}
                            {task.engagement && (
                              <div className="flex items-center space-x-4 text-sm">
                                <span className="text-gray-600">
                                  浏览: {task.engagement.views}
                                </span>
                                <span className="text-gray-600">
                                  点赞: {task.engagement.likes}
                                </span>
                                <span className="text-gray-600">
                                  评论: {task.engagement.comments}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* 操作按钮 */}
                        <div className="flex items-center space-x-2 flex-shrink-0">
                          {(task.status === "scheduled" ||
                            task.status === "pending") && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleToggleTask(task.id)}
                              className="flex items-center space-x-1"
                            >
                              {task.status === "scheduled" ? (
                                <Pause size={14} />
                              ) : (
                                <Play size={14} />
                              )}
                              <span>
                                {task.status === "scheduled" ? "暂停" : "启动"}
                              </span>
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center space-x-1"
                          >
                            <Edit size={14} />
                            <span>编辑</span>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteTask(task.id)}
                            className="flex items-center space-x-1 text-red-600 hover:text-red-700"
                          >
                            <Trash2 size={14} />
                            <span>删除</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
