const { app, BrowserWindow, ipcMain, shell, Notification } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn, exec } = require('child_process');
const { initialize, enable } = require('@electron/remote/main');
const fs = require('fs');

// 初始化remote模块
initialize();

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 960,
    minHeight: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    icon: path.join(__dirname, 'assets/icons/app-icon.png'),
    autoHideMenuBar: true  // 自动隐藏菜单栏
  });
  
  // 为窗口启用remote模块
  enable(mainWindow.webContents);

  // 修改这里 - 开发模式下使用webpack-dev-server的URL，否则加载打包后的HTML
  if (isDev) {
    // 直接加载webpack编译的文件，确保webpack编译过文件
    mainWindow.loadFile(path.join(__dirname, 'dist/index.html'));
    // mainWindow.webContents.openDevTools(); // 注释掉这行，不自动打开开发者工具
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

// 检查文件占用情况 - 使用更高效的方式
ipcMain.handle('check-file-occupancy', async (event, filePath) => {
  return new Promise((resolve, reject) => {
    // 使用handle.exe工具检查文件占用
    // handle.exe是Windows Sysinternals工具，性能比PowerShell更高
    // 这里使用更优化的PowerShell命令，使用Windows API的方式捕获文件句柄
    const command = `powershell.exe`;
    const script = `
      # 设置PowerShell编码为UTF-8
      [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
      $OutputEncoding = [System.Text.Encoding]::UTF8
      
      $ErrorActionPreference = "Stop"
      try {
        Add-Type -TypeDefinition @"
        using System;
        using System.Collections.Generic;
        using System.Runtime.InteropServices;
        using System.Text;
        using System.IO;

        public class FileUtil {
            [DllImport("kernel32.dll", CharSet = CharSet.Unicode)]
            public static extern IntPtr CreateFile(
                string lpFileName,
                uint dwDesiredAccess,
                uint dwShareMode,
                IntPtr lpSecurityAttributes,
                uint dwCreationDisposition,
                uint dwFlagsAndAttributes,
                IntPtr hTemplateFile);

            public static bool IsFileInUse(string filePath) {
                IntPtr handle = CreateFile(
                    filePath,
                    0x80000000, // GENERIC_READ
                    0,          // No sharing
                    IntPtr.Zero,
                    3,          // OPEN_EXISTING
                    0,
                    IntPtr.Zero);

                bool inUse = handle.ToInt64() == -1;
                if (!inUse) {
                    Marshal.CloseHandle(handle);
                }
                return inUse;
            }
        }
"@

        $path = "${filePath}"
        $isDirectory = Test-Path -Path $path -PathType Container
        
        if ($isDirectory) {
          # 检查目录中的文件
          $processes = Get-Process | Where-Object { $_.Modules.FileName -like "*$path*" } | Select-Object Id, ProcessName, Path
        } else {
          # 检查特定文件
          $isLocked = [FileUtil]::IsFileInUse($path)
          
          if ($isLocked) {
            # 获取占用该文件的进程信息
            $processes = Get-Process | Where-Object { 
              $proc = $_
              foreach ($module in $proc.Modules) {
                if ($module.FileName -eq $path) { return $true }
              }
              
              # 检查打开的文件句柄
              $handles = & "handle.exe" -p $proc.Id $path 2>&1
              if ($handles -match [regex]::Escape($path)) { return $true }
              
              return $false
            } | Select-Object Id, ProcessName, Path
          } else {
            $processes = @()
          }
        }
        
        # 如果handle.exe不可用，则使用常规的模块检查
        $processes = Get-Process | Where-Object {
          $_.Modules.FileName -like "*$path*"
        } | Select-Object Id, ProcessName, Path
        
        # 移除了不兼容的-Encoding参数
        ConvertTo-Json -InputObject $processes -Depth 3
      } catch {
        Write-Error "An error occurred: $_"
        exit 1
      }
    `;
    
    const ps = spawn(command, ['-NoProfile', '-Command', script], {
      encoding: 'utf8',
      env: { ...process.env, PYTHONIOENCODING: 'utf-8' }
    });
    
    let stdout = '';
    let stderr = '';

    ps.stdout.on('data', (data) => {
      stdout += data.toString('utf8');
    });

    ps.stderr.on('data', (data) => {
      stderr += data.toString('utf8');
    });

    ps.on('close', (code) => {
      if (code !== 0) {
        // 如果高级方法失败，回退到更基本的方法
        const fallbackCmd = `powershell.exe -NoProfile -Command "[Console]::OutputEncoding = [System.Text.Encoding]::UTF-8; $OutputEncoding = [System.Text.Encoding]::UTF-8; Get-Process | Where-Object {$_.Modules.FileName -like '*${filePath}*'} | Select-Object Id, ProcessName, Path | ConvertTo-Json -Depth 3"`;
        
        exec(fallbackCmd, { encoding: 'utf8' }, (error, stdout, stderr) => {
          if (error) {
            reject(`检查失败: ${error.message}`);
            return;
          }
          
          try {
            const data = stdout.trim();
            const processes = data ? JSON.parse(data) : [];
            // 确保返回数组，即使只有一个结果
            resolve(Array.isArray(processes) ? processes : [processes]);
          } catch (parseError) {
            reject(`解析失败: ${parseError.message}`);
          }
        });
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

// 结束进程 - 使用更高效的方式
ipcMain.handle('kill-process', async (event, processId) => {
  return new Promise((resolve, reject) => {
    // 在Windows上，使用taskkill命令更可靠且速度更快
    const command = `taskkill /F /PID ${processId}`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        // 如果taskkill失败，尝试使用PowerShell
        const psCommand = `powershell.exe -NoProfile -Command "Stop-Process -Id ${processId} -Force -ErrorAction SilentlyContinue"`;
        
        exec(psCommand, (psError, psStdout, psStderr) => {
          if (psError) {
            reject(`无法结束进程: ${psError.message}`);
          } else {
            resolve(true);
          }
        });
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
