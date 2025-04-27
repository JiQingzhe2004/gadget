import React, { useState } from 'react';
import { Layout, theme } from 'antd';
import Sidebar from './components/Sidebar';
import FileOccupancyTool from '../tools/file-occupancy';

const { Content } = Layout;

const App = () => {
  const [currentTool, setCurrentTool] = useState('file-occupancy');
  const [collapsed, setCollapsed] = useState(false);
  
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };

  const renderTool = () => {
    switch (currentTool) {
      case 'file-occupancy':
        return <FileOccupancyTool />;
      default:
        return <div>请选择一个工具</div>;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', height: '100vh', overflow: 'hidden' }}>
      <Sidebar 
        currentTool={currentTool} 
        onToolSelect={setCurrentTool}
        collapsed={collapsed}
        toggleCollapsed={toggleCollapsed}
      />
      <Layout>
        <Content style={{ margin: '16px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          <div 
            style={{ 
              padding: 24, 
              flex: 1,
              background: colorBgContainer, 
              borderRadius: borderRadiusLG,
              transition: 'all 0.2s',
              display: 'flex', 
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            {renderTool()}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default App;
