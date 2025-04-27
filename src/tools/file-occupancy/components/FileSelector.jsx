import React, { useState } from 'react';
import { Input, Button, Card, message, Space, Radio } from 'antd';
import { FileSearchOutlined, FolderOpenOutlined, SearchOutlined } from '@ant-design/icons';
import { checkFileOccupancy } from '../utils/fileUtils';
import showNotification from '../../../renderer/utils/notification';

// 修改远程模块导入方式
const electron = window.require('electron');
const remote = window.require('@electron/remote');
const { dialog } = remote;

const FileSelector = ({ onPathSelected, onProcessFound, onLoadingChange }) => {
  const [filePath, setFilePath] = useState('');
  const [searchType, setSearchType] = useState('file');

  const handleBrowse = async () => {
    try {
      const properties = searchType === 'file' 
        ? ['openFile'] 
        : ['openDirectory'];
      
      const result = await dialog.showOpenDialog({
        properties,
        filters: searchType === 'file' ? [
          { name: 'All Files', extensions: ['*'] }
        ] : []
      });
      
      if (!result.canceled && result.filePaths.length > 0) {
        setFilePath(result.filePaths[0]);
        onPathSelected(result.filePaths[0]);
      }
    } catch (error) {
      message.error(`选择路径失败: ${error.message}`);
    }
  };

  const handleCheck = async () => {
    if (!filePath) {
      message.warning('请先选择文件或文件夹');
      return;
    }

    try {
      onLoadingChange(true);
      const processes = await checkFileOccupancy(filePath);
      onProcessFound(processes);
      
      if (processes.length === 0) {
        showNotification('文件占用检测', '没有进程占用该文件或文件夹');
        message.info('没有进程占用该文件或文件夹');
      } else {
        showNotification('文件占用检测', `发现 ${processes.length} 个占用进程`);
      }
    } catch (error) {
      message.error(`检查失败: ${error.message}`);
    } finally {
      onLoadingChange(false);
    }
  };

  return (
    <Card title="选择文件或文件夹" className="file-selector-card">
      <Radio.Group 
        value={searchType} 
        onChange={e => setSearchType(e.target.value)}
        style={{ marginBottom: '16px' }}
      >
        <Radio.Button value="file">文件</Radio.Button>
        <Radio.Button value="folder">文件夹</Radio.Button>
      </Radio.Group>
      
      <Space style={{ width: '100%' }}>
        <Input 
          placeholder={`请选择${searchType === 'file' ? '文件' : '文件夹'}路径`}
          value={filePath}
          onChange={e => {
            setFilePath(e.target.value);
            onPathSelected(e.target.value);
          }}
          prefix={searchType === 'file' ? <FileSearchOutlined /> : <FolderOpenOutlined />}
          style={{ width: '70%' }}
        />
        <Button type="primary" onClick={handleBrowse}>
          浏览
        </Button>
        <Button 
          type="primary" 
          onClick={handleCheck}
          className="check-button"
          icon={<SearchOutlined />}
        >
          检查占用
        </Button>
      </Space>
    </Card>
  );
};

export default FileSelector;
