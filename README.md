# 文件工具集 - 开发指南

## 项目概述

这是一个基于Electron和React开发的Windows桌面应用，旨在提供多种文件管理工具，目前包含文件占用检测工具，后续将拓展更多功能。

## 项目结构

**严格遵循以下项目结构是必须的！**

```
文件占用检测/
├── assets/                  # 静态资源
│   └── icons/               # 应用图标
│       └── app-icon.png     # 应用主图标 (必须是PNG格式)
├── src/
│   ├── renderer/            # 渲染进程代码
│   │   ├── components/      # 通用组件
│   │   ├── styles/          # 全局样式
│   │   ├── utils/           # 通用工具函数
│   │   ├── App.jsx          # 主应用组件
│   │   ├── index.html       # HTML模板
│   │   └── index.jsx        # 渲染进程入口
│   └── tools/               # 工具模块目录
│       ├── file-occupancy/  # 文件占用检测工具
│       │   ├── components/  # 工具特定组件
│       │   ├── utils/       # 工具特定工具函数
│       │   ├── styles/      # 工具特定样式
│       │   ├── README.md    # 工具说明文档 (必须)
│       │   └── index.jsx    # 工具入口组件
│       └── [other-tool]/    # 其他工具遵循同样的结构
├── docs/                    # 项目文档
│   └── TOOL_README_TEMPLATE.md  # 工具说明文件模板
├── main.js                  # 主进程入口
├── webpack.config.js        # Webpack配置
├── package.json             # 项目配置
└── README.md                # 项目说明 (本文件)
```

## 开发规范

### 1. 严格遵循项目结构

- **必须**按照上述项目结构组织代码
- **禁止**随意创建文件或打破项目结构
- 每次添加新文件前，请确认其在项目结构中的正确位置

### 2. 每个工具必须有独立文件夹

- 所有工具放置在 `src/tools/` 目录下
- 每个工具有自己的文件夹，包含完整的组件、样式和工具函数
- 工具之间的代码必须严格分离，通用功能放在 `src/renderer/` 下

### 3. 文档要求

- **每个工具必须包含README.md文件**，说明工具的用途、使用方法和实现原理
- 主README.md文件(本文件)用于整体项目描述和开发指南
- 所有文档应当保持更新，与代码同步

### 4. 样式规范

- 组件尺寸使用百分比和弹性布局，确保UI响应式
- 样式代码和功能代码分离
- 通用样式放在 `src/renderer/styles/`
- 工具特定样式放在对应工具的 `styles/` 目录下

### 5. 命名规范

- 文件夹名：小写字母，使用连字符分隔，如 `file-occupancy`
- 组件文件：PascalCase，如 `FileSelector.jsx`
- 工具函数文件：camelCase，如 `fileUtils.js`
- React组件：PascalCase，如 `const FileSelector = () => {...}`
- 函数和变量：camelCase，如 `const handleClick = () => {...}`

### 6. 代码规范

- 使用ES6+语法
- 使用函数式组件和React Hooks
- 适当添加注释，尤其是复杂逻辑
- 遵循DRY原则(Don't Repeat Yourself)，提取公共逻辑

## 新工具开发流程

1. 在 `src/tools/` 下创建新的工具文件夹
2. 复制 `docs/TOOL_README_TEMPLATE.md` 到工具文件夹下并重命名为 `README.md`
3. 填写工具说明文档
4. 创建工具的组件、样式和工具函数
5. 在 `src/renderer/App.jsx` 中添加新工具
6. 在 `src/renderer/components/Sidebar.jsx` 中添加新工具入口

## 注意事项

- **禁止**修改项目结构
- **禁止**随意添加新的依赖，需要讨论后决定
- **禁止**将业务逻辑放在主进程，除非必要
- **确保**每个工具都有完整的说明文档
- **确保**应用图标使用PNG格式

## 使用说明

- 首先安装所需依赖：`npm install`
- 开发模式运行：`npm run dev`
- 打包应用：`npm run build`

## 构建与运行

- 开发模式：`npm run dev`
- 构建应用：`npm run build`
- 运行应用：`npm start`

## 常见问题解决

### Electron安装错误

如果遇到 "Electron failed to install correctly" 错误，请按照以下步骤操作：

1. 删除electron模块：
   ```bash
   rd /s /q node_modules\electron
   ```

2. 设置Electron镜像（国内用户推荐）：
   ```bash
   # CMD
   set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/
   
   # PowerShell
   $env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
   ```

3. 重新安装electron：
   ```bash
   npm install electron --save-dev
   ```

4. 如果仍然失败，尝试使用cnpm安装：
   ```bash
   npm install -g cnpm --registry=https://registry.npmmirror.com
   cnpm install electron --save-dev
   ```

5. 也可以尝试使用yarn安装：
   ```bash
   yarn add electron --dev
   ```

### 其他安装问题

如果遇到依赖安装卡住或其他问题：

1. 清除npm缓存：
   ```bash
   npm cache clean --force
   ```

2. 使用淘宝镜像：
   ```bash
   npm install --registry=https://registry.npmmirror.com
   ```

3. 检查Node.js版本，推荐使用LTS版本（16.x或18.x）：
   ```bash
   node -v
   ```

---

**重要提示：任何不符合上述规范的代码将被拒绝合并！**
