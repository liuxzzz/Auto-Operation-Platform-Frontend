"use client";

import { Bookmark, Home, Images, Send, Sparkles, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

interface NavbarProps {
  onClose?: () => void;
  className?: string;
}

export function Navbar({ onClose, className }: NavbarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      href: "/",
      label: "首页",
      icon: Home,
    },
    {
      href: "/account-manage",
      label: "账号管理",
      icon: User,
    },
    {
      href: "/hot-library",
      label: "爆款库",
      icon: Sparkles,
    },
    {
      href: "/my-collection",
      label: "我的收藏",
      icon: Bookmark,
    },
    {
      href: "/material-manage",
      label: "素材管理",
      icon: Images,
    },
    {
      href: "/publish-center",
      label: "发布中心",
      icon: Send,
    },
  ];

  return (
    <nav
      className={cn(
        "flex flex-col h-full bg-gray-50 border-r border-gray-200",
        className
      )}
    >
      {/* Mobile header */}
      <div className="flex items-center justify-center p-4 border-b border-gray-200 lg:hidden">
        <h2 className="text-lg font-semibold">菜单</h2>
      </div>

      {/* Desktop header */}
      <div className="hidden lg:block p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">羊之甘鹿自媒体自动化运营系统</h2>
      </div>

      {/* Navigation items */}
      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map(item => {
            const Icon = item.icon;
            // 更精确的路径匹配逻辑
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                  onClick={onClose} // Close mobile menu when navigating
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          © 2024 羊之甘鹿自媒体自动化运营系统
        </p>
      </div>
    </nav>
  );
}
