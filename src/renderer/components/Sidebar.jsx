import React from 'react';
import { Layout, Menu, Typography } from 'antd';
import { 
  FileSearchOutlined, 
  AppstoreOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined
} from '@ant-design/icons';

const { Sider } = Layout;
const { Title } = Typography;

const Sidebar = ({ currentTool, onToolSelect, collapsed, toggleCollapsed }) => {
  const items = [
    {
      key: 'file-occupancy',
      icon: <FileSearchOutlined />,
      label: '文件占用检测',
    },
    // 未来可以在这里添加更多工具
  ];

  return (
    <Sider 
      width={200} 
      collapsible 
      collapsed={collapsed} 
      trigger={null}
      style={{ background: '#001529' }}
    >
      <div className="logo" style={{ 
        height: '64px', 
        margin: '16px', 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center' 
      }}>
        <AppstoreOutlined style={{ fontSize: '24px', color: 'white' }} />
        {!collapsed && (
          <Title level={4} style={{ color: 'white', marginLeft: '8px', marginBottom: 0 }}>
            文件工具集
          </Title>
        )}
      </div>
      <div className="sidebar-toggle" 
        onClick={toggleCollapsed} 
        style={{ 
          padding: '0 16px', 
          marginBottom: '16px', 
          textAlign: 'right', 
          color: 'white',
          cursor: 'pointer'
        }}
      >
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
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
