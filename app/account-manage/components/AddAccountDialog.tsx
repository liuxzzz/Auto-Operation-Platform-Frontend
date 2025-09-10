"use client";

import { useState } from "react";

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
import { Platform } from "@/lib/types";

interface AddAccountDialogProps {
  children: React.ReactNode;
}

export function AddAccountDialog({ children }: AddAccountDialogProps) {
  const [platform, setPlatform] = useState("");
  const [accountName, setAccountName] = useState("");
  const [open, setOpen] = useState(false);

  const platforms = [
    { value: Platform.KUAISHOU, label: Platform.KUAISHOU },
    { value: Platform.DOUYIN, label: Platform.DOUYIN },
    { value: Platform.WEIXIN_VIDEO, label: Platform.WEIXIN_VIDEO },
    { value: Platform.XIAOHONGSHU, label: Platform.XIAOHONGSHU },
  ];

  const handleSubmit = () => {
    if (!platform || !accountName.trim()) {
      return;
    }

    // TODO: 实现添加账号逻辑
    // 添加账号: { platform, accountName }

    // 重置表单
    setPlatform("");
    setAccountName("");

    setOpen(false);
  };

  const handleCancel = () => {
    setPlatform("");
    setAccountName("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>添加账号</DialogTitle>
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
              <Select value={platform} onValueChange={setPlatform}>
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
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleCancel}>
            取消
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!platform || !accountName.trim()}
          >
            添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
