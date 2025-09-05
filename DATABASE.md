# 数据库集成指南

本项目已集成 **Prisma + PostgreSQL** 数据库方案，支持本地开发和 Vercel 部署。

## 🚀 快速开始

### 1. 环境配置

复制环境变量示例文件：

```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，配置您的数据库连接：

#### 本地开发 (使用本地 PostgreSQL)

```env
POSTGRES_PRISMA_URL="postgresql://username:password@localhost:5432/xiaolu_workflows?pgbouncer=true&connect_timeout=15"
POSTGRES_URL_NON_POOLING="postgresql://username:password@localhost:5432/xiaolu_workflows"
DATABASE_URL="postgresql://username:password@localhost:5432/xiaolu_workflows"
```

#### 或使用 Vercel Postgres (推荐)

1. 在 Vercel 控制台创建 PostgreSQL 数据库
2. 复制连接字符串到环境变量

### 2. 数据库初始化

```bash
# 生成 Prisma 客户端
pnpm db:generate

# 推送数据库 schema (首次使用)
pnpm db:push

# 或创建迁移文件 (推荐用于生产)
pnpm db:migrate
```

### 3. 数据迁移

将现有 JSON 数据导入数据库：

```bash
pnpm db:seed
```

### 4. 启动开发服务器

```bash
pnpm dev
```

## 📊 数据库结构

### ContentItem (内容表)

- `noteId`: 主键，内容唯一标识
- `title`, `desc`: 标题和描述
- `userId`, `nickname`, `avatar`: 用户信息
- `sourceKeyword`: 分类关键词
- `likes`, `collections`: 关联的点赞和收藏

### UserLike (用户点赞表)

- `userId`, `noteId`: 复合主键
- `createdAt`: 点赞时间

### UserCollection (用户收藏表)

- `userId`, `noteId`: 复合主键
- `createdAt`: 收藏时间

## 🛠️ 常用命令

```bash
# 数据库相关
pnpm db:generate    # 生成 Prisma 客户端
pnpm db:push        # 推送 schema 到数据库
pnpm db:migrate     # 创建和应用迁移
pnpm db:reset       # 重置数据库
pnpm db:studio      # 打开 Prisma Studio (数据库可视化工具)
pnpm db:seed        # 迁移 JSON 数据到数据库

# 开发相关
pnpm dev            # 启动开发服务器
pnpm build          # 构建项目
pnpm start          # 启动生产服务器
```

## 🔧 API 更新

所有 API 路由已更新为使用 Prisma：

### 内容 API

- `GET /api/content` - 获取内容列表 (支持分页和分类筛选)
- `POST /api/content` - 创建新内容
- `GET /api/content/[id]` - 获取单个内容
- `PUT /api/content/[id]` - 更新内容
- `DELETE /api/content/[id]` - 删除内容

### 用户交互 API

- `GET /api/user/likes?userId=xxx` - 获取用户点赞列表
- `POST /api/user/likes` - 点赞/取消点赞
- `GET /api/user/collections?userId=xxx` - 获取用户收藏列表
- `POST /api/user/collections` - 收藏/取消收藏

## 🚀 Vercel 部署

### 1. 创建 Vercel Postgres 数据库

1. 登录 Vercel 控制台
2. 选择您的项目
3. 进入 "Storage" 选项卡
4. 点击 "Create Database" → "Postgres"
5. 创建完成后，复制环境变量

### 2. 配置环境变量

在 Vercel 项目设置中添加以下环境变量：

- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `DATABASE_URL`

### 3. 部署

```bash
# 部署到 Vercel
vercel

# 或使用 Git 推送自动部署
git push origin main
```

部署完成后，Vercel 会自动：

- 安装依赖
- 生成 Prisma 客户端
- 构建项目
- 应用数据库 schema

### 4. 生产数据迁移

部署成功后，在 Vercel 函数中运行数据迁移：

```bash
# 在 Vercel CLI 中运行
vercel env pull .env.local
pnpm db:seed
```

## 🎯 最佳实践

### 1. 开发环境

- 使用 `pnpm db:push` 快速同步 schema 变更
- 使用 `pnpm db:studio` 可视化管理数据
- 定期备份重要数据

### 2. 生产环境

- 使用 `pnpm db:migrate` 创建迁移文件
- 谨慎进行 schema 变更
- 监控数据库性能

### 3. 数据安全

- 定期备份数据库
- 使用环境变量管理敏感信息
- 限制数据库访问权限

## 🐛 常见问题

### 1. 连接超时

```bash
# 检查网络连接和数据库状态
pnpm db:studio
```

### 2. Schema 同步问题

```bash
# 重新生成客户端
pnpm db:generate

# 重置数据库 (谨慎使用)
pnpm db:reset
```

### 3. 迁移冲突

```bash
# 查看迁移状态
npx prisma migrate status

# 手动解决冲突后
npx prisma migrate resolve --applied "迁移名称"
```

## 📚 相关文档

- [Prisma 官方文档](https://www.prisma.io/docs/)
- [Vercel Postgres 文档](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js 数据库集成](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

如有问题，请查看项目的 [ARCHITECTURE_V2.md](./ARCHITECTURE_V2.md) 了解完整的架构设计。
