const { ipcRenderer } = window.require('electron');

// 检查文件占用情况
export const checkFileOccupancy = async (filePath) => {
  try {
    const processes = await ipcRenderer.invoke('check-file-occupancy', filePath);
    return processes;
  } catch (error) {
    console.error('Error checking file occupancy:', error);
    throw new Error(`无法检查文件占用: ${error}`);
  }
};

// 结束进程
export const killProcess = async (processId) => {
  try {
    await ipcRenderer.invoke('kill-process', processId);
    return true;
  } catch (error) {
    console.error('Error killing process:', error);
    throw new Error(`无法结束进程: ${error}`);
  }
};
