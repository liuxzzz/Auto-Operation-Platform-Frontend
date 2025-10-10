"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Loading } from "@/components/ui/loading";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Account, Platform } from "@/lib/types";

import { deleteAccount, getAccounts } from "../../api/account";

import { AddAccountDialog } from "./components/AddAccountDialog";

export default function AccountManage() {
  const tabs = [
    { id: "全部", label: "全部" },
    { id: Platform.KUAISHOU, label: "快手" },
    { id: Platform.DOUYIN, label: "抖音" },
    { id: Platform.WEIXIN_VIDEO, label: "视频号" },
    { id: Platform.XIAOHONGSHU, label: "小红书" },
  ];

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [activeTab, setActiveTab] = useState("全部");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<{
    [key: string]: "edit" | "delete" | null;
  }>({});
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  // 获取平台显示名称
  const getPlatformLabel = (platform: string) => {
    const tab = tabs.find(t => t.id === platform);
    return tab ? tab.label : platform;
  };

  // 获取状态显示文本
  const getStatusText = (status: 0 | 1) => {
    return status === 1 ? "正常" : "禁用";
  };

  // 获取状态样式
  const getStatusStyle = (status: 0 | 1) => {
    return status === 1
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  // 过滤账号数据
  const filteredAccounts = accounts.filter(account => {
    if (activeTab === "全部") return true;
    return account.platform === activeTab;
  });

  // 编辑账号
  const handleEdit = (account: Account) => {
    setEditingAccount(account);
  };

  // 编辑完成回调
  const handleEditComplete = () => {
    setEditingAccount(null);
    // 重新获取账号列表
    fetchAccounts();
  };

  // 删除账号
  const handleDelete = async (account: Account) => {
    setActionLoading(prev => ({ ...prev, [account.id]: "delete" }));
    try {
      await deleteAccount(account.id);
      // 删除成功后重新获取账号列表
      await fetchAccounts();
    } catch {
      setError("删除账号失败，请稍后重试");
    } finally {
      setActionLoading(prev => ({ ...prev, [account.id]: null }));
    }
  };

  // 获取账号列表
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAccounts();
      const { data } = res;
      if (data && data.accounts) {
        setAccounts(data.accounts);
      } else {
        setAccounts([]);
      }
    } catch {
      setError("获取账号列表失败，请稍后重试");
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

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
        {/* <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-3/5"
          >
            <TabsList className="grid w-full grid-cols-5 bg-gray-100">
              {tabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id} className="text-sm">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div> */}

        {/* Loading状态 */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm p-12">
            <Loading message="正在加载账号列表..." fullScreen={false} />
          </div>
        ) : error ? (
          /* 错误状态 */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">加载失败</h3>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchAccounts} variant="outline">
              重新加载
            </Button>
          </div>
        ) : filteredAccounts.length > 0 ? (
          /* 账号列表 */
          <div className="bg-white rounded-lg shadow-sm">
            {/* 表格头部操作栏 */}
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">
                账号列表 ({filteredAccounts.length})
              </h2>
              <AddAccountDialog>
                <Button>添加账号</Button>
              </AddAccountDialog>
            </div>

            {/* 表格内容 */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[200px]">名称</TableHead>
                    <TableHead className="w-[150px]">平台</TableHead>
                    <TableHead className="w-[100px]">状态</TableHead>
                    <TableHead className="w-[200px]">操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAccounts.map(account => (
                    <TableRow key={account.id}>
                      <TableCell className="font-medium">
                        {account.account_name}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getPlatformLabel(account.platform)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusStyle(
                            account.status
                          )}`}
                        >
                          {getStatusText(account.status)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(account)}
                          >
                            编辑
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(account)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            {actionLoading[account.id] === "delete" ? (
                              <>
                                <Spinner size="sm" className="mr-2" />
                                删除中...
                              </>
                            ) : (
                              "删除"
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        ) : (
          /* 空状态 */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📱</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === "全部"
                ? "暂无账号"
                : `暂无${getPlatformLabel(activeTab)}账号`}
            </h3>
            <p className="text-gray-600 mb-6">
              {activeTab === "全部"
                ? "还没有添加任何账号，点击下方按钮添加第一个账号"
                : `还没有添加任何${getPlatformLabel(activeTab)}账号，点击下方按钮添加`}
            </p>
            <AddAccountDialog>
              <Button>添加账号</Button>
            </AddAccountDialog>
          </div>
        )}
      </div>

      {/* 编辑账号弹窗 */}
      {editingAccount && (
        <AddAccountDialog
          editAccount={editingAccount}
          onEditComplete={handleEditComplete}
          onRefreshAccountList={fetchAccounts}
        >
          <div style={{ display: "none" }} />
        </AddAccountDialog>
      )}
    </div>
  );
}
