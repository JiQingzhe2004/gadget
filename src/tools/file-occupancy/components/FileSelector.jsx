import React, { useState } from 'react';
import { Input, Button, Card, message, Space, Radio, Tooltip } from 'antd';
import { 
  FileSearchOutlined, 
  FolderOpenOutlined, 
  SearchOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import { checkFileOccupancy } from '../utils/fileUtils';
import showNotification from '../../../renderer/utils/notification';

// 修改远程模块导入方式
const electron = window.require('electron');
const remote = window.require('@electron/remote');
const { dialog } = remote;

const FileSelector = ({ onPathSelected, onProcessFound, onLoadingChange }) => {
  const [filePath, setFilePath] = useState('');
  const [searchType, setSearchType] = useState('file');
  const [isSearching, setIsSearching] = useState(false);

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
        const selectedPath = result.filePaths[0];
        setFilePath(selectedPath);
        onPathSelected(selectedPath);
        
        // 自动检查占用
        handleCheck(selectedPath);
      }
    } catch (error) {
      message.error(`选择路径失败: ${error.message}`);
    }
  };

  const handleCheck = async (path = filePath) => {
    if (!path) {
      message.warning('请先选择文件或文件夹');
      return;
    }

    try {
      setIsSearching(true);
      onLoadingChange(true);
      const processes = await checkFileOccupancy(path);
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
      setIsSearching(false);
      onLoadingChange(false);
    }
  };

  return (
    <Card 
      title={
        <Space>
          {searchType === 'file' ? <FileSearchOutlined /> : <FolderOpenOutlined />}
          <span>选择{searchType === 'file' ? '文件' : '文件夹'}</span>
        </Space>
      }
      className="file-selector-card"
      bodyStyle={{ paddingBottom: '8px' }}
    >
      <Radio.Group 
        value={searchType} 
        onChange={e => setSearchType(e.target.value)}
        style={{ marginBottom: '16px' }}
        buttonStyle="solid"
      >
        <Radio.Button value="file">
          <FileSearchOutlined /> 文件
        </Radio.Button>
        <Radio.Button value="folder">
          <FolderOpenOutlined /> 文件夹
        </Radio.Button>
      </Radio.Group>
      
      <Input.Group compact style={{ width: '100%', display: 'flex' }}>
        <Input 
          placeholder={`请选择${searchType === 'file' ? '文件' : '文件夹'}路径`}
          value={filePath}
          onChange={e => {
            setFilePath(e.target.value);
            onPathSelected(e.target.value);
          }}
          style={{ flex: 1 }}
          allowClear
        />
        <Tooltip title="浏览">
          <Button onClick={handleBrowse}>
            浏览
          </Button>
        </Tooltip>
        <Tooltip title="检查占用">
          <Button 
            type="primary" 
            onClick={() => handleCheck()}
            className="check-button"
            icon={isSearching ? <LoadingOutlined /> : <SearchOutlined />}
            disabled={isSearching}
          >
            检查占用
          </Button>
        </Tooltip>
      </Input.Group>
    </Card>
  );
};

export default FileSelector;
