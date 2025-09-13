"use client";

import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import React, { useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Account, CreateAccountRequest, Platform } from "@/lib/types";

import { updateAccount } from "../../../api/account";

interface AddAccountDialogProps {
  children: React.ReactNode;
  editAccount?: Account;
  onEditComplete?: () => void;
  onRefreshAccountList?: () => void;
}

export function AddAccountDialog({
  children,
  editAccount,
  onEditComplete,
  onRefreshAccountList,
}: AddAccountDialogProps) {
  const isEditMode = !!editAccount;
  const [platform, setPlatform] = useState(
    editAccount?.platform || Platform.XIAOHONGSHU
  );
  const [accountName, setAccountName] = useState(
    editAccount?.account_name || "test"
  );
  const [sseConnecting, setSseConnecting] = useState(false);
  const [qrCodeData, setQrCodeData] = useState("");
  const [loginStatus, setLoginStatus] = useState(""); //用来展示登录状态信息展示
  const [open, setOpen] = useState(false);

  // 编辑模式下自动打开弹窗
  React.useEffect(() => {
    if (isEditMode && editAccount) {
      setOpen(true);
    }
  }, [isEditMode, editAccount]);
  const [updating, setUpdating] = useState(false);
  const eventSource = useRef<EventSource | null>(null);

  const platforms = [
    { value: Platform.KUAISHOU, label: "快手" },
    { value: Platform.DOUYIN, label: "抖音" },
    { value: Platform.WEIXIN_VIDEO, label: "视频号" },
    { value: Platform.XIAOHONGSHU, label: "小红书" },
  ];

  const handleSubmit = async () => {
    if (!platform || !accountName.trim()) {
      return;
    }

    if (isEditMode && editAccount) {
      // 编辑模式：更新账号名称
      try {
        setUpdating(true);
        await updateAccount({
          ...editAccount,
          account_name: accountName.trim(),
        });
        toast.success("账号更新成功");
        onEditComplete?.();
        setOpen(false);
      } catch {
        toast.error("账号更新失败");
      } finally {
        setUpdating(false);
      }
    } else {
      // 添加模式：调用SSE接口创建账号
      createAccountSSE({ platform, account_name: accountName });

      // 重置表单
      setPlatform(Platform.XIAOHONGSHU);
      setAccountName("test");
      //重新获取账号列表

      // setOpen(false);
    }
  };

  const handleCancel = () => {
    setPlatform(Platform.XIAOHONGSHU);
    setAccountName("test");
    resetAllStates();
    setOpen(false);
  };

  const createAccountSSE = async (account: CreateAccountRequest) => {
    setSseConnecting(true);
    setLoginStatus("");
    setQrCodeData("");
    closeSSEConnection();
    eventSource.current = new EventSource(
      `${process.env.NEXT_PUBLIC_API_URL}/accounts/create?platform=${encodeURIComponent(account.platform)}&account_name=${encodeURIComponent(account.account_name)}`
    );

    eventSource.current.onmessage = event => {
      const data = event.data;

      // 如果还没有二维码数据，且数据长度较长，认为是二维码
      if (!qrCodeData && data.length > 100) {
        if (data.startsWith("data:image")) {
          // qrCodeData.value = data;
          setQrCodeData(data);
        } else {
          // 否则添加前缀
          setQrCodeData(`data:image/png;base64,${data}`);
        }
      } else if (data === "200" || data === "500") {
        setLoginStatus(data);
        // 如果登录成功
        if (data === "200") {
          closeSSEConnection();

          setTimeout(() => {
            // setLoginStatus("");
            //关闭弹窗
            setOpen(false);
            toast.success("添加账号成功");
            setSseConnecting(false);
            onRefreshAccountList?.();
            //重新获取账号信息
          }, 1000);
        } else {
          // 登录失败，关闭连接
          closeSSEConnection();

          // 2秒后重置状态，允许重试
          setTimeout(() => {
            setSseConnecting(false);
            setQrCodeData("");
            setLoginStatus("");
          }, 2000);
        }
      }
    };

    eventSource.current.onerror = _error => {
      // SSE连接错误处理
      eventSource.current?.close();
    };
  };

  const closeSSEConnection = () => {
    if (eventSource.current) {
      eventSource.current.close();
      eventSource.current = null;
    }
  };

  const resetAllStates = () => {
    setSseConnecting(false);
    setQrCodeData("");
    setLoginStatus("");
    closeSSEConnection();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen);
        if (!isOpen) {
          resetAllStates();
          if (isEditMode) {
            onEditComplete?.();
          }
        }
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "编辑账号" : "添加账号"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-row gap-2 justify-between items-center">
            <label
              htmlFor="platform"
              className="text-right text-sm font-medium"
            >
              平台
            </label>
            <div className="w-full flex-1">
              <Select
                value={platform}
                onValueChange={value => setPlatform(value as Platform)}
                disabled={isEditMode}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="选择平台" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-center gap-2 w-full">
            <label
              htmlFor="name"
              className="text-right text-sm font-medium w-[28px]"
            >
              名称
            </label>
            <div className="w-full flex-1">
              <Input
                id="name"
                value={accountName}
                onChange={e => setAccountName(e.target.value)}
                placeholder="请输入账号名称"
                className="col-span-3"
              />
            </div>
          </div>

          {/* 登录状态显示区域 */}
          {sseConnecting && (
            <div className="flex flex-col items-start justify-center">
              {/* 状态提示UI */}
              {!qrCodeData && !loginStatus && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Spinner size="sm" />
                  请求中...
                </div>
              )}

              {loginStatus === "200" && (
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  添加成功
                </div>
              )}

              {loginStatus === "500" && (
                <div className="flex items-center gap-2 text-sm text-red-600">
                  <XCircle className="w-4 h-4" />
                  添加失败，稍后重试
                </div>
              )}

              {qrCodeData && (
                <div className="text-sm text-gray-500">
                  <p className="qrcode-tip">请使用对应平台APP扫描二维码登录</p>
                  <Image
                    src={qrCodeData}
                    alt="二维码"
                    width={130}
                    height={130}
                  />
                </div>
              )}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={
              !platform ||
              !accountName.trim() ||
              sseConnecting ||
              updating ||
              (isEditMode && accountName.trim() === editAccount?.account_name)
            }
          >
            {updating ? (
              <>
                <Spinner size="sm" />
                更新中...
              </>
            ) : sseConnecting ? (
              <>
                <Spinner size="sm" />
                连接中...
              </>
            ) : isEditMode ? (
              "更新"
            ) : (
              "添加"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
