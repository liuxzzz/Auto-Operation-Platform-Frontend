"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Platform } from "@/lib/types";

import { AddAccountDialog } from "./components/AddAccountDialog";

export default function AccountManage() {
  const tabs = [
    { id: "全部", label: "全部" },
    { id: Platform.KUAISHOU, label: "快手" },
    { id: Platform.DOUYIN, label: "抖音" },
    { id: Platform.WEIXIN_VIDEO, label: "视频号" },
    { id: Platform.XIAOHONGSHU, label: "小红书" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 头部 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">账号管理</h1>
        </div>
      </div>

      {/* 内容区域 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 标签页导航 */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Tabs defaultValue="全部" className="w-3/5">
            <TabsList className="grid w-full grid-cols-5 bg-gray-100">
              {tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {tabs.map(tab => (
              <TabsContent key={tab.id} value={tab.id} className="mt-6">
                {/* 这里可以放置每个标签页的内容 */}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* 空状态 */}
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <div className="text-gray-400 text-6xl mb-4">📱</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无账号</h3>
          <p className="text-gray-600 mb-6">
            还没有添加任何账号，点击下方按钮添加第一个账号
          </p>
          <AddAccountDialog>
            <Button>添加账号</Button>
          </AddAccountDialog>
        </div>
      </div>
    </div>
  );
}
