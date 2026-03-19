# 酒店前端管理系统

基于 Vue3 + TypeScript + Vite 构建的酒店管理系统前端应用。

## 技术栈

- **框架**: Vue3
- **前端工程化**: Eslint + Prettier + TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router
- **UI 组件库**: Ant Design Vue 4.2.6
- **HTTP 请求**: Axios
- **设备指纹**: @fingerprintjs/fingerprintjs 5.1.0
- **接口文档生成**: @umijs/openapi 1.4.1

## 功能模块

- 首页管理
- 订单管理
- 客房管理
- 用户管理
- 商品管理
- 员工管理
- 财务报表
- 指纹识别
- 后台管理

## 开发指南

### 环境要求

- Node.js 22+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 构建生产版本

```bash
# 类型检查并构建
npm run build

# 仅构建（不进行类型检查）
npm run pure-build
```

### 预览生产构建

```bash
npm run preview
```

### 代码生成

从后端 Swagger 文档生成 API 服务代码：

```bash
npm run openapi
```

> 注意：需要后端服务运行在 `http://localhost:8110`

### 代码质量

```bash
# ESLint 检查并自动修复
npm run lint

# Prettier 格式化代码
npm run format
```

## 项目结构

```
wangjia_frontend/
├── src/
│   ├── access/           # 权限控制
│   ├── assets/           # 静态资源
│   ├── components/       # 公共组件
│   ├── layouts/          # 布局组件
│   ├── pages/            # 页面组件
│   │   ├── admin/        # 后台管理页面
│   │   ├── error/        # 错误页面
│   │   ├── fingerprint/  # 指纹相关页面
│   │   ├── job/          # 员工管理页面
│   │   ├── money_info/   # 财务报表页面
│   │   ├── order/        # 订单管理页面
│   │   ├── room/         # 客房管理页面
│   │   ├── shop/         # 商品管理页面
│   │   └── user/         # 用户管理页面
│   ├── router/           # 路由配置
│   ├── service/          # API 服务
│   ├── stores/           # 状态管理
│   ├── App.vue           # 根组件
│   ├── main.ts           # 入口文件
│   └── request.ts        # HTTP 请求封装
├── public/               # 公共静态资源
├── dist/                 # 构建输出目录
├── index.html            # HTML 模板
├── package.json          # 项目配置文件
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── openapi.config.js     # OpenAPI 生成配置
```

## 配置说明

### 路径别名

项目配置了 `@` 别名指向 `src` 目录：

```typescript
import Component from '@/components/Component.vue'
```

### API 生成

使用 `@umijs/openapi` 自动生成 API 服务代码，配置位于 `openapi.config.js`：

- **schemaPath**: 后端 Swagger 文档地址
- **output**: 生成代码输出目录
- **requestLibPath**: 使用的请求库路径

## 开发规范

- 遵循 ESLint 规则
- 使用 Prettier 统一代码格式
- TypeScript 严格模式
- 组件命名采用 PascalCase
- 文件命名采用 camelCase

## 浏览器支持

推荐使用现代浏览器：

- Chrome (最新版)
- Firefox (最新版)
- Edge (最新版)
- Safari (最新版)

## 常见问题

### 1. OpenAPI 生成失败

确保后端服务已启动且可访问 `http://localhost:8110/api/v2/api-docs?group=default`。

### 2. 类型检查错误

运行 `npm run type-check` 查看详细类型错误信息。

### 3. 样式冲突

Ant Design Vue 样式已通过 `reset.css` 重置，如遇到样式问题请检查 CSS 优先级。

## 许可证

私有项目，未经许可不得用于商业用途。
