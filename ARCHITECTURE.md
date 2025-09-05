# 项目架构说明

## 🏗️ 整体架构

本项目采用 **Next.js 全栈架构**，前后端代码在同一个项目中，共享类型定义和工具函数。

## 📁 项目结构

```
Xiaolu-Workflows/
├── app/                          # Next.js 应用
│   ├── (routes)/                 # 页面路由
│   │   ├── content-preview/      # 内容预览页面
│   │   ├── content-manage/       # 内容管理页面
│   │   └── page.tsx             # 首页
│   ├── api/                     # API 路由 (后端)
│   │   ├── content/             # 内容相关 API
│   │   │   ├── route.ts         # GET/POST /api/content
│   │   │   └── [id]/route.ts    # GET/PUT/DELETE /api/content/[id]
│   │   ├── user/                # 用户相关 API
│   │   │   ├── likes/route.ts   # 用户点赞 API
│   │   │   └── collections/route.ts # 用户收藏 API
│   │   └── test/route.ts        # API 测试端点
│   ├── globals.css              # 全局样式
│   └── layout.tsx               # 根布局
├── components/                   # React 组件
│   ├── ui/                      # 基础 UI 组件
│   ├── ContentCard.tsx          # 内容卡片组件
│   ├── Navbar.tsx               # 导航栏组件
│   └── ResponsiveLayout.tsx     # 响应式布局组件
├── lib/                         # 工具库
│   ├── services/                # 服务层
│   │   ├── contentService.ts    # 内容服务
│   │   └── userService.ts       # 用户服务
│   ├── hooks/                   # 自定义 Hook
│   │   ├── useContent.ts        # 内容管理 Hook
│   │   └── useUserInteractions.ts # 用户交互 Hook
│   ├── api.ts                   # API 工具函数
│   └── utils.ts                 # 通用工具函数
├── types/                       # 类型定义
│   ├── content.ts               # 内容相关类型
│   └── api.ts                   # API 相关类型
└── utils/                       # 工具函数
    └── imageUtils.ts            # 图片处理工具
```

## 🔄 数据流

### 1. 前端数据流

```
页面组件 → 自定义 Hook → 服务层 → API 路由 → 数据存储
```

### 2. 具体实现

- **页面组件**: 使用自定义 Hook 管理状态
- **自定义 Hook**: 封装业务逻辑和状态管理
- **服务层**: 处理 API 调用和数据转换
- **API 路由**: 处理 HTTP 请求和响应
- **数据存储**: 当前使用内存存储，可扩展为数据库

## 🛠️ 核心组件

### 1. 服务层 (Services)

- **ContentService**: 内容 CRUD 操作
- **UserService**: 用户交互管理

### 2. 自定义 Hook

- **useContent**: 内容数据管理
- **useUserInteractions**: 用户点赞/收藏管理

### 3. API 路由

- **GET /api/content**: 获取内容列表
- **POST /api/content**: 创建内容
- **GET /api/content/[id]**: 获取单个内容
- **PUT /api/content/[id]**: 更新内容
- **DELETE /api/content/[id]**: 删除内容
- **GET /api/user/likes**: 获取用户点赞
- **POST /api/user/likes**: 更新用户点赞
- **GET /api/user/collections**: 获取用户收藏
- **POST /api/user/collections**: 更新用户收藏

## 🎯 使用示例

### 1. 在页面中使用内容 Hook

```typescript
import { useContent } from "@/lib/hooks/useContent";

export default function ContentPage() {
  const {
    allContent,
    filteredContent,
    loading,
    error,
    filterByCategory,
    createContent,
  } = useContent();

  // 使用数据...
}
```

### 2. 在页面中使用用户交互 Hook

```typescript
import { useUserInteractions } from "@/lib/hooks/useUserInteractions";

export default function ContentPage() {
  const { handleLike, handleCollect, isLiked, isCollected } =
    useUserInteractions();

  // 使用交互功能...
}
```

### 3. 直接使用服务层

```typescript
import { contentService } from "@/lib/services/contentService";

// 获取内容
const content = await contentService.getContent({ category: "穿搭" });

// 创建内容
const newContent = await contentService.createContent({
  title: "新内容",
  desc: "内容描述",
});
```

## 🔧 配置说明

### 1. 环境变量

```env
NEXT_PUBLIC_API_URL=  # API 基础 URL (可选)
```

### 2. 类型安全

- 前后端共享 TypeScript 类型
- API 响应类型统一管理
- 运行时数据验证

## 🚀 部署

### 1. 开发环境

```bash
pnpm dev
```

### 2. 生产环境

```bash
pnpm build
pnpm start
```

### 3. Vercel 部署

- 一键部署整个应用
- 自动处理 API 路由
- 无需额外配置

## 📈 扩展建议

### 1. 数据库集成

- 使用 Prisma + PostgreSQL
- 替换内存存储
- 添加数据迁移

### 2. 认证系统

- 集成 NextAuth.js
- 添加用户管理
- 实现权限控制

### 3. 缓存优化

- 添加 Redis 缓存
- 实现数据预加载
- 优化 API 性能

### 4. 文件上传

- 支持图片上传
- 集成云存储
- 图片处理优化

## 🎉 优势

1. **一体化架构**: 前后端代码统一管理
2. **类型安全**: TypeScript 类型共享
3. **开发效率**: 无需配置跨域、类型同步
4. **部署简单**: Vercel 一键部署
5. **成本低**: 无需维护多个项目
6. **可扩展**: 易于添加新功能

## 🔍 测试

### 1. API 测试

```bash
# 测试 API 是否正常
curl http://localhost:3000/api/test
```

### 2. 功能测试

- 内容预览页面
- 内容管理页面
- 用户交互功能

## 📚 相关文档

- [开发指南](./DEVELOPMENT.md)
- [API 文档](./API.md)
- [组件文档](./COMPONENTS.md)
