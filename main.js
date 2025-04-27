const { app, BrowserWindow, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');
const { initialize, enable } = require('@electron/remote/main');

// 初始化remote模块
initialize();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 960,
    height: 720,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icons/app-icon.png')
  });
  
  // 为窗口启用remote模块
  enable(mainWindow.webContents);

  // 修改这里 - 开发模式下使用webpack-dev-server的URL，否则加载打包后的HTML
  if (isDev) {
    // 直接加载webpack编译的文件，确保webpack编译过文件
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    mainWindow.webContents.openDevTools(); // 打开开发者工具以便调试
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// 检查文件占用情况
ipcMain.handle('check-file-occupancy', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    const command = `powershell.exe`;
    const args = [
      '-NoProfile', 
      '-Command', 
      `Get-Process | Where-Object {$_.Modules.FileName -like '*${filePath}*'} | Select-Object Id, ProcessName, Path | ConvertTo-Json`
    ];
    
    const ps = spawn(command, args);
    let stdout = '';
    let stderr = '';

    ps.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    ps.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ps.on('close', (code) => {
      if (code !== 0) {
        reject(stderr);
      } else {
        try {
          const data = stdout.trim();
          const processes = data ? JSON.parse(data) : [];
          // 确保返回数组，即使只有一个结果
          resolve(Array.isArray(processes) ? processes : [processes]);
        } catch (error) {
          reject(`解析失败: ${error.message}`);
        }
      }
    });
  });
});

// 结束进程
ipcMain.handle('kill-process', async (event, processId) => {
  return new Promise((resolve, reject) => {
    const command = `powershell.exe`;
    const args = ['-NoProfile', '-Command', `Stop-Process -Id ${processId} -Force`];
    
    const ps = spawn(command, args);
    let stderr = '';

    ps.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    ps.on('close', (code) => {
      if (code !== 0) {
        reject(stderr);
      } else {
        resolve(true);
      }
    });
  });
});

// 显示系统通知
ipcMain.on('show-notification', (event, { title, body }) => {
  new Notification({ title, body }).show();
});
