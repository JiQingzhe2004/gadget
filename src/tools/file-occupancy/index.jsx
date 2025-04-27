import React, { useState } from 'react';
import { Typography, Divider, Card } from 'antd';
import { FileSearchOutlined } from '@ant-design/icons';
import FileSelector from './components/FileSelector';
import ProcessList from './components/ProcessList';
import './styles/index.css';

const { Title } = Typography;

const FileOccupancyTool = () => {
  const [selectedPath, setSelectedPath] = useState('');
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);

  const handlePathSelected = (path) => {
    setSelectedPath(path);
  };

  const handleProcessFound = (foundProcesses) => {
    setProcesses(foundProcesses);
  };

  const handleLoadingChange = (isLoading) => {
    setLoading(isLoading);
  };

  const handleProcessKilled = () => {
    // 当进程被杀死后，重新检查文件占用
    if (selectedPath) {
      const fileSelector = document.querySelector('button.check-button');
      if (fileSelector) {
        fileSelector.click();
      }
    }
  };

  return (
    <div className="file-occupancy-tool">
      <Card className="tool-header-card">
        <Title level={2} style={{ display: 'flex', alignItems: 'center', margin: 0 }}>
          <FileSearchOutlined style={{ marginRight: '12px' }} />
          文件占用检测工具
        </Title>
      </Card>
      
      <FileSelector 
        onPathSelected={handlePathSelected} 
        onProcessFound={handleProcessFound}
        onLoadingChange={handleLoadingChange}
      />
      
      <ProcessList 
        processes={processes} 
        selectedPath={selectedPath}
        loading={loading}
        onProcessKilled={handleProcessKilled}
      />
    </div>
  );
};

export default FileOccupancyTool;
