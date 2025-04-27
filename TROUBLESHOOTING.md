# 故障排除指南

## NPM安装依赖卡住的解决方案

如果在运行`npm install`时遇到依赖安装卡住的问题，请尝试以下解决方案：

### 方案1: 清除NPM缓存

```bash
# 清除NPM缓存
npm cache clean --force

# 重新安装依赖
npm install
```

### 方案2: 使用淘宝镜像源

```bash
# 使用package.json中预设的脚本
npm run install:taobao

# 或者直接使用以下命令
npm install --registry=https://registry.npmmirror.com
```

### 方案3: 使用其他包管理器

```bash
# 使用yarn
npm run install:yarn
# 或者直接
yarn install

# 使用pnpm
npm run install:pnpm
# 或者直接
pnpm install

# 使用cnpm
npm install -g cnpm --registry=https://registry.npmmirror.com
npm run install:cnpm
```

### 方案4: 处理防火墙或网络问题

- 检查你的防火墙设置是否阻止了npm
- 尝试使用VPN或其他网络连接
- 如果在公司网络环境，咨询IT部门是否有代理设置要求

### 方案5: 分步安装关键依赖

有时一次性安装所有依赖可能会遇到问题，尝试先安装核心依赖：

```bash
# 先安装React和Electron
npm install react react-dom electron --save

# 然后安装其他依赖
npm install electron-is-dev antd @ant-design/icons --save
npm install @babel/core @babel/preset-env @babel/preset-react babel-loader --save-dev
# ...依次安装其他依赖
```

### 方案6: 跳过警告

你看到的警告不会影响应用运行，可以使用`--no-audit`和`--no-fund`标志来减少输出：

```bash
npm install --no-audit --no-fund
```

### 方案7: 更新NPM

有时候更新npm本身也能解决问题：

```bash
npm install -g npm@latest
```

## 其他常见问题

### Electron无法下载

Electron二进制文件下载经常会卡住，可以设置环境变量：

```bash
# Windows (CMD)
set ELECTRON_MIRROR=https://npmmirror.com/mirrors/electron/

# Windows (PowerShell)
$env:ELECTRON_MIRROR="https://npmmirror.com/mirrors/electron/"
```

然后再安装：

```bash
npm install electron --save-dev
```

### Node版本兼容性

确保你使用的Node.js版本与依赖兼容。推荐使用Node.js 16.x或18.x。

```bash
# 检查Node版本
node -v
```

如果需要管理多个Node版本，可以使用nvm：

```bash
# 安装Node.js 18
nvm install 18
nvm use 18
```

希望以上解决方案能帮助你解决安装依赖的问题！
