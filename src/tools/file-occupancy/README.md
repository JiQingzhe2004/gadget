# 文件占用检测工具

## 功能概述

文件占用检测工具允许用户选择文件或文件夹，检查当前被哪些进程占用，并可以直接结束占用进程。这对于无法删除、移动或修改文件时非常有用。

## 技术实现

### 核心API
- 使用Windows PowerShell命令检查文件占用情况
- 使用Electron的IPC机制在渲染进程和主进程之间通信
- 使用Node.js的`child_process`模块执行系统命令

### 实现细节
- 文件占用检测：使用PowerShell的`Get-Process`和`Where-Object`命令查找占用特定文件的进程
- 进程结束：使用PowerShell的`Stop-Process`命令结束指定进程
- 通知系统：使用Electron的`Notification`API展示系统通知

### 使用的第三方库
- Ant Design：提供UI组件
- React：构建用户界面

## 组件结构

```
file-occupancy/
├── components/             # 组件目录
│   ├── FileSelector.jsx    # 文件选择组件
│   └── ProcessList.jsx     # 进程列表组件
├── utils/                  # 工具函数
│   └── fileUtils.js        # 文件操作相关工具函数
├── styles/                 # 样式
│   └── index.css           # 工具特定样式
├── README.md               # 本说明文档
└── index.jsx               # 工具入口组件
```

## 组件说明

### FileSelector.jsx
- 功能：提供文件或文件夹选择界面和检查占用按钮
- 属性：
  - `onPathSelected`: 当路径被选择时的回调函数
  - `onProcessFound`: 当找到占用进程时的回调函数
  - `onLoadingChange`: 加载状态变化时的回调函数
- 方法：
  - `handleBrowse()`: 打开文件选择对话框
  - `handleCheck()`: 检查文件占用情况

### ProcessList.jsx
- 功能：显示占用进程列表并提供结束进程功能
- 属性：
  - `processes`: 进程列表数据
  - `selectedPath`: 当前选择的文件或文件夹路径
  - `loading`: 是否正在加载
  - `onProcessKilled`: 当进程被结束时的回调函数
- 方法：
  - `handleKillProcess()`: 结束指定进程
  - `showConfirm()`: 显示确认对话框

## 使用方法

1. 在界面上选择检测类型（文件或文件夹）
2. 点击"浏览"按钮选择要检查的文件或文件夹
3. 点击"检查占用"按钮
4. 在结果列表中查看占用该文件/文件夹的进程
5. 如需结束进程，点击对应进程行的"结束进程"按钮
6. 在确认对话框中确认操作

## 注意事项

- 结束系统进程可能导致应用程序不稳定或数据丢失，请谨慎操作
- 某些系统进程无法被普通用户权限结束，可能需要管理员权限
- 对于大型文件夹，扫描可能需要一些时间
- 某些特殊文件（如系统文件）可能无法准确检测占用情况

## 未来改进

- 添加管理员权限运行选项
- 提供更详细的进程信息（CPU使用率、内存占用等）
- 添加自动刷新功能
- 添加历史记录功能
- 改进文件夹扫描性能

## 维护者

- 项目开发团队

---

**使用前请确保了解结束进程可能带来的风险！**
