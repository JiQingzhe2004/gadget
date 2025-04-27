import React, { useState } from 'react';
import { Typography, Divider } from 'antd';
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

  return (
    <div className="file-occupancy-tool">
      <Title level={2}>文件占用检测工具</Title>
      <Divider />
      
      <FileSelector 
        onPathSelected={handlePathSelected} 
        onProcessFound={handleProcessFound}
        onLoadingChange={handleLoadingChange}
      />
      
      <Divider />
      
      <ProcessList 
        processes={processes} 
        selectedPath={selectedPath}
        loading={loading}
        onProcessKilled={() => {
          // 当进程被杀死后，重新检查文件占用
          if (selectedPath) {
            const fileSelector = document.querySelector('button.check-button');
            if (fileSelector) {
              fileSelector.click();
            }
          }
        }}
      />
    </div>
  );
};

export default FileOccupancyTool;
