"use client";

import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Calendar, Edit, FileEdit, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DraftItem } from "@/types";

export default function DraftBox() {
  const router = useRouter();
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [draftToDelete, setDraftToDelete] = useState<string | null>(null);

  // 从 localStorage 加载草稿
  useEffect(() => {
    loadDrafts();
  }, []);

  const loadDrafts = () => {
    try {
      const savedDrafts = localStorage.getItem("content_drafts");
      if (savedDrafts) {
        const parsedDrafts = JSON.parse(savedDrafts);
        // 按更新时间倒序排列
        const sortedDrafts = parsedDrafts.sort(
          (a: DraftItem, b: DraftItem) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setDrafts(sortedDrafts);
      }
    } catch (error) {
      console.error("加载草稿失败:", error);
      toast("加载草稿失败", {
        description: "草稿数据可能已损坏",
      });
    }
  };

  const handleEdit = (draftId: string) => {
    // 跳转到发布中心并带上草稿ID
    router.push(`/publish-center?draftId=${draftId}`);
  };

  const handleDeleteClick = (draftId: string) => {
    setDraftToDelete(draftId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!draftToDelete) return;

    try {
      const savedDrafts = localStorage.getItem("content_drafts");
      if (savedDrafts) {
        const parsedDrafts = JSON.parse(savedDrafts);
        const updatedDrafts = parsedDrafts.filter(
          (draft: DraftItem) => draft.id !== draftToDelete
        );
        localStorage.setItem("content_drafts", JSON.stringify(updatedDrafts));
        setDrafts(updatedDrafts);
        toast("草稿已删除");
      }
    } catch (error) {
      console.error("删除草稿失败:", error);
      toast("删除失败", {
        description: "请稍后重试",
      });
    } finally {
      setDeleteDialogOpen(false);
      setDraftToDelete(null);
    }
  };

  const handleCreateNew = () => {
    router.push("/publish-center");
  };

  const getPlatformLabel = (platform: string) => {
    const platformMap: Record<string, string> = {
      xiaohongshu: "小红书",
      douyin: "抖音",
      kuaishou: "快手",
      weixin_video: "微信视频号",
    };
    return platformMap[platform] || platform;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy年MM月dd日 HH:mm", {
        locale: zhCN,
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileEdit className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">草稿箱</h1>
                <p className="text-sm text-gray-500 mt-1">
                  管理您保存的内容草稿
                </p>
              </div>
            </div>
            <Button onClick={handleCreateNew} className="flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              创建新内容
            </Button>
          </div>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {drafts.length === 0 ? (
          // 空状态
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileEdit className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无草稿</h3>
            <p className="text-gray-500 mb-6">
              您还没有保存任何草稿，创建新内容并保存为草稿吧
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              创建新内容
            </Button>
          </div>
        ) : (
          // 草稿列表
          <div>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                共{" "}
                <span className="font-medium text-gray-900">
                  {drafts.length}
                </span>{" "}
                个草稿
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drafts.map(draft => (
                <div
                  key={draft.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200"
                >
                  {/* 图片预览 */}
                  {draft.images && draft.images.length > 0 ? (
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      <img
                        src={draft.images[0]}
                        alt={draft.title}
                        className="w-full h-full object-cover"
                      />
                      {draft.images.length > 1 && (
                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                          +{draft.images.length - 1}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="aspect-video bg-gray-100 flex items-center justify-center">
                      <FileEdit className="h-12 w-12 text-gray-300" />
                    </div>
                  )}

                  {/* 内容信息 */}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3rem]">
                      {draft.title || "未命名草稿"}
                    </h3>

                    <p className="text-sm text-gray-600 mb-3 line-clamp-2 min-h-[2.5rem]">
                      {draft.description || "暂无描述"}
                    </p>

                    {/* 平台标签 */}
                    {draft.platform && (
                      <div className="mb-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getPlatformLabel(draft.platform)}
                        </span>
                      </div>
                    )}

                    {/* 时间信息 */}
                    <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{formatDate(draft.updatedAt)}</span>
                      </div>
                    </div>

                    {/* 操作按钮 */}
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEdit(draft.id)}
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        编辑
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteClick(draft.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 删除确认对话框 */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除草稿</DialogTitle>
            <DialogDescription>
              确定要删除这个草稿吗？此操作无法撤销。
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              取消
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              删除
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
