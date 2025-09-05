# 开发指南

本项目配置了完整的代码质量工具链，包括 ESLint、Prettier、TypeScript 类型检查和 Git hooks。

## 🛠️ 工具配置

### ESLint

- **配置文件**: `.eslintrc.js`
- **功能**: 代码质量检查、React/TypeScript 最佳实践
- **规则**: 包含 React、TypeScript、导入顺序、未使用变量等规则

### Prettier

- **配置文件**: `.prettierrc`
- **功能**: 代码格式化
- **规则**: 统一的代码风格，包括缩进、引号、分号等

### TypeScript

- **配置文件**: `tsconfig.json`
- **功能**: 类型检查
- **规则**: 严格的类型检查配置

### Git Hooks (Husky + lint-staged)

- **pre-commit**: 提交前自动运行 ESLint 和 Prettier
- **commit-msg**: 检查 commit message 格式

## 📜 可用脚本

```bash
# 开发
pnpm dev                 # 启动开发服务器

# 代码质量检查
pnpm lint               # 运行 ESLint 检查
pnpm lint:fix           # 运行 ESLint 并自动修复
pnpm format             # 运行 Prettier 格式化
pnpm format:check       # 检查代码格式
pnpm type-check         # 运行 TypeScript 类型检查
pnpm check-all          # 运行所有检查（类型检查 + ESLint + 格式检查）

# 构建
pnpm build              # 构建生产版本
pnpm start              # 启动生产服务器
```

## 🎯 工作流程

### 1. 开发时

- VSCode 会自动格式化代码（保存时）
- ESLint 会在编辑器中显示错误和警告
- 使用 `pnpm check-all` 进行完整检查

### 2. 提交代码时

- Git hooks 会自动运行 lint-staged
- 自动修复可修复的 ESLint 错误
- 自动格式化代码
- 检查 commit message 格式

### 3. Commit Message 格式

使用约定式提交格式：

```
<type>(<scope>): <description>

feat(auth): add user login functionality
fix(ui): resolve button alignment issue
docs(readme): update installation guide
```

**类型**:

- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `test`: 测试相关
- `chore`: 构建/工具相关
- `perf`: 性能优化
- `ci`: CI/CD 相关
- `build`: 构建相关
- `revert`: 回滚提交

## 🔧 VSCode 配置

项目包含完整的 VSCode 配置：

### 推荐扩展

- **ESLint**: 代码质量检查
- **Prettier**: 代码格式化
- **Tailwind CSS IntelliSense**: Tailwind 类名提示
- **TypeScript Importer**: 自动导入
- **GitLens**: Git 增强
- **Material Icon Theme**: 文件图标

### 自动功能

- 保存时自动格式化
- 自动修复 ESLint 错误
- 自动整理导入语句
- 智能代码补全

## 📁 项目结构

```
├── .vscode/              # VSCode 配置
│   ├── settings.json     # 编辑器设置
│   ├── extensions.json   # 推荐扩展
│   └── launch.json       # 调试配置
├── .husky/               # Git hooks
│   ├── pre-commit        # 提交前检查
│   └── commit-msg        # 提交信息检查
├── .eslintrc.js          # ESLint 配置
├── .prettierrc           # Prettier 配置
├── .prettierignore       # Prettier 忽略文件
├── .eslintignore         # ESLint 忽略文件
└── package.json          # 项目配置和脚本
```

## 🚨 常见问题

### 1. ESLint 错误

```bash
# 自动修复
pnpm lint:fix

# 手动检查
pnpm lint
```

### 2. 格式问题

```bash
# 自动格式化
pnpm format

# 检查格式
pnpm format:check
```

### 3. 类型错误

```bash
# 类型检查
pnpm type-check
```

### 4. Git hooks 不工作

```bash
# 重新安装 husky
pnpm exec husky install
```

## 📚 最佳实践

1. **提交前检查**: 始终运行 `pnpm check-all` 确保代码质量
2. **小步提交**: 频繁提交，每次提交解决一个问题
3. **清晰的 commit message**: 使用约定式提交格式
4. **代码审查**: 提交 PR 前进行自我审查
5. **保持更新**: 定期更新依赖和工具版本

## 🔄 持续集成

在 CI/CD 流程中，建议运行：

```bash
pnpm install
pnpm check-all
pnpm build
```

这确保了代码质量、类型安全和构建成功。
