# 项目架构 V2.0

## 🏗️ 架构概览

本项目采用 **分层架构模式**，将代码按照职责清晰分层，提高可维护性和可扩展性。

## 📁 目录结构

```
Xiaolu-Workflows/
├── app/                          # Next.js 应用层
│   ├── (routes)/                 # 页面路由
│   │   ├── content-preview/      # 内容预览页面
│   │   ├── content-manage/       # 内容管理页面
│   │   └── page.tsx             # 首页
│   ├── api/                     # API 路由层
│   │   ├── content/             # 内容相关 API
│   │   ├── user/                # 用户相关 API
│   │   └── test/                # 测试 API
│   ├── globals.css              # 全局样式
│   └── layout.tsx               # 根布局
├── components/                   # 组件层
│   ├── ui/                      # 基础 UI 组件
│   ├── ContentCard.tsx          # 业务组件
│   ├── Navbar.tsx               # 导航组件
│   └── ResponsiveLayout.tsx     # 布局组件
├── lib/                         # 核心业务层
│   ├── services/                # 服务层
│   │   ├── BaseService.ts       # 基础服务类
│   │   ├── contentService.ts    # 内容服务
│   │   ├── userService.ts       # 用户服务
│   │   └── index.ts             # 服务层导出
│   ├── hooks/                   # 自定义 Hook 层
│   │   ├── useContent.ts        # 内容管理 Hook
│   │   └── useUserInteractions.ts # 用户交互 Hook
│   ├── utils/                   # 工具层
│   │   ├── http.ts              # HTTP 工具
│   │   └── index.ts             # 工具层导出
│   ├── constants/               # 常量层
│   │   ├── api.ts               # API 常量
│   │   ├── app.ts               # 应用常量
│   │   └── index.ts             # 常量层导出
│   ├── types/                   # 类型层
│   │   ├── common.ts            # 通用类型
│   │   └── index.ts             # 类型层导出
│   └── index.ts                 # 主入口文件
├── types/                       # 全局类型定义
│   ├── content.ts               # 内容类型
│   └── api.ts                   # API 类型
└── utils/                       # 全局工具函数
    └── imageUtils.ts            # 图片工具
```

## 🔄 架构层次

### 1. 表现层 (Presentation Layer)

- **位置**: `app/(routes)/`, `components/`
- **职责**: 用户界面展示和交互
- **特点**: 纯展示逻辑，不包含业务逻辑

### 2. 业务逻辑层 (Business Logic Layer)

- **位置**: `lib/hooks/`, `lib/services/`
- **职责**: 业务逻辑处理和状态管理
- **特点**: 可复用的业务逻辑，独立于 UI

### 3. 数据访问层 (Data Access Layer)

- **位置**: `lib/services/`, `app/api/`
- **职责**: 数据获取和持久化
- **特点**: 统一的数据访问接口

### 4. 基础设施层 (Infrastructure Layer)

- **位置**: `lib/utils/`, `lib/constants/`
- **职责**: 通用工具和配置
- **特点**: 可复用的基础设施代码

## 🛠️ 核心组件

### 1. 服务层 (Services)

#### BaseService

```typescript
export abstract class BaseService {
  protected handleError(error: unknown): never;
  protected handleResponse<T>(response: BaseResponse): Promise<T>;
  protected handlePaginatedResponse<T>(
    response: PaginatedResponse<T>
  ): Promise<{ data: T[]; pagination: any }>;
}
```

#### ContentService

```typescript
export class ContentService extends BaseService {
  async getContent(params?: QueryParams): Promise<ContentItem[]>;
  async getContentById(id: string): Promise<ContentItem | null>;
  async createContent(data: Partial<ContentItem>): Promise<ContentItem | null>;
  async updateContent(
    id: string,
    data: Partial<ContentItem>
  ): Promise<ContentItem | null>;
  async deleteContent(id: string): Promise<boolean>;
}
```

#### UserService

```typescript
export class UserService extends BaseService {
  async getUserLikes(userId: string): Promise<string[]>;
  async updateUserLikes(
    userId: string,
    noteId: string,
    action: UserAction
  ): Promise<boolean>;
  async getUserCollections(userId: string): Promise<string[]>;
  async updateUserCollections(
    userId: string,
    noteId: string,
    action: UserAction
  ): Promise<boolean>;
}
```

### 2. HTTP 工具层

#### 核心功能

- **统一错误处理**: HttpError 类
- **重试机制**: 自动重试失败的请求
- **超时控制**: 可配置的请求超时
- **类型安全**: 完整的 TypeScript 支持

#### 使用示例

```typescript
import { get, post, put, del } from "@/lib/utils/http";

// GET 请求
const data = await get<DataResponse<ContentItem[]>>("/api/content");

// POST 请求
const result = await post<DataResponse<ContentItem>>(
  "/api/content",
  contentData
);

// PUT 请求
const updated = await put<DataResponse<ContentItem>>(
  `/api/content/${id}`,
  updateData
);

// DELETE 请求
const success = await del<DataResponse<any>>(`/api/content/${id}`);
```

### 3. 自定义 Hook 层

#### useContent

```typescript
export function useContent() {
  return {
    allContent, // 所有内容
    filteredContent, // 筛选后的内容
    loading, // 加载状态
    error, // 错误信息
    loadContent, // 加载内容
    filterByCategory, // 按分类筛选
    getCategories, // 获取分类列表
    createContent, // 创建内容
    updateContent, // 更新内容
    deleteContent, // 删除内容
  };
}
```

#### useUserInteractions

```typescript
export function useUserInteractions(userId?: string) {
  return {
    likedItems, // 点赞列表
    collectedItems, // 收藏列表
    loading, // 加载状态
    handleLike, // 处理点赞
    handleCollect, // 处理收藏
    isLiked, // 检查是否已点赞
    isCollected, // 检查是否已收藏
    loadUserInteractions, // 加载用户交互数据
  };
}
```

## 🎯 设计原则

### 1. 单一职责原则 (SRP)

- 每个类/函数只负责一个功能
- 服务层只处理业务逻辑
- 工具层只提供通用功能

### 2. 开闭原则 (OCP)

- 对扩展开放，对修改关闭
- 通过继承 BaseService 扩展新服务
- 通过 Hook 组合扩展新功能

### 3. 依赖倒置原则 (DIP)

- 高层模块不依赖低层模块
- 通过接口和抽象类解耦
- 使用依赖注入管理依赖

### 4. 接口隔离原则 (ISP)

- 客户端不应依赖不需要的接口
- 细粒度的 Hook 设计
- 按需导入功能模块

## 🚀 使用指南

### 1. 导入方式

#### 统一导入

```typescript
import { useContent, useUserInteractions, contentService } from "@/lib";
```

#### 按需导入

```typescript
import { useContent } from "@/lib/hooks/useContent";
import { contentService } from "@/lib/services";
import { API_ENDPOINTS } from "@/lib/constants";
```

### 2. 在页面中使用

```typescript
"use client";

import { useContent, useUserInteractions } from "@/lib";

export default function ContentPage() {
  const {
    allContent,
    filteredContent,
    loading,
    error,
    filterByCategory,
    createContent,
  } = useContent();

  const { handleLike, handleCollect, isLiked, isCollected } =
    useUserInteractions();

  // 使用数据和方法...
}
```

### 3. 在服务中使用

```typescript
import { contentService, userService } from "@/lib/services";

// 直接使用服务
const content = await contentService.getContent({ category: "穿搭" });
const success = await userService.updateUserLikes("user1", "note1", "like");
```

## 🔧 配置说明

### 1. 环境变量

```env
NEXT_PUBLIC_API_URL=  # API 基础 URL
```

### 2. 常量配置

```typescript
// lib/constants/api.ts
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
};

// lib/constants/app.ts
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};
```

## 📈 扩展指南

### 1. 添加新服务

```typescript
// lib/services/newService.ts
import { BaseService } from "./BaseService";

export class NewService extends BaseService {
  // 实现新服务的方法
}
```

### 2. 添加新 Hook

```typescript
// lib/hooks/useNewFeature.ts
import { useState, useEffect } from "react";

export function useNewFeature() {
  // 实现新 Hook 的逻辑
}
```

### 3. 添加新工具

```typescript
// lib/utils/newUtil.ts
export function newUtilFunction() {
  // 实现新工具函数
}
```

## 🎉 架构优势

1. **清晰的分层**: 职责明确，易于理解和维护
2. **高度复用**: 服务层和工具层可在多处使用
3. **类型安全**: 完整的 TypeScript 类型支持
4. **易于测试**: 各层独立，便于单元测试
5. **可扩展性**: 通过继承和组合轻松扩展功能
6. **统一管理**: 通过索引文件统一导出和导入

## 🔍 最佳实践

1. **服务层**: 继承 BaseService，使用统一的错误处理
2. **Hook 层**: 封装业务逻辑，提供简洁的 API
3. **工具层**: 提供纯函数，无副作用
4. **常量层**: 集中管理配置，避免魔法数字
5. **类型层**: 定义清晰的接口，保证类型安全

这个架构为项目提供了坚实的基础，支持快速开发和长期维护。
