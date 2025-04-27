import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import Sidebar from './components/Sidebar';
import FileOccupancyTool from '../tools/file-occupancy';

const { Content } = Layout;

const App = () => {
  const [currentTool, setCurrentTool] = useState('file-occupancy');
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const renderTool = () => {
    switch (currentTool) {
      case 'file-occupancy':
        return <FileOccupancyTool />;
      default:
        return <div>请选择一个工具</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar currentTool={currentTool} onToolSelect={setCurrentTool} />
      <Layout>
        <Content style={{ margin: '16px' }}>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer, borderRadius: '8px' }}>
            {renderTool()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
