import React from 'react';
import { Layout, Menu } from 'antd';
import { FileSearchOutlined, ToolOutlined } from '@ant-design/icons';

const { Sider } = Layout;

const Sidebar = ({ currentTool, onToolSelect }) => {
  const items = [
    {
      key: 'file-occupancy',
      icon: <FileSearchOutlined />,
      label: '文件占用检测',
    },
    // 未来可以在这里添加更多工具
  ];

  return (
    <Sider width="20%" style={{ background: '#001529' }}>
      <div className="logo" style={{ height: '64px', margin: '16px', background: 'rgba(255, 255, 255, 0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <ToolOutlined style={{ fontSize: '24px', color: 'white' }} />
        <span style={{ color: 'white', marginLeft: '8px', fontSize: '18px' }}>文件工具集</span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentTool]}
        items={items}
        onClick={e => onToolSelect(e.key)}
      />
    </Sider>
  );
};

export default Sidebar;
