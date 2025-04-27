import React, { useState } from 'react';
import { Table, Button, Card, message, Modal, Empty, Spin, Space, Badge, Tooltip, Typography } from 'antd';
import { 
  ExclamationCircleOutlined, 
  StopOutlined, 
  InfoCircleOutlined,
  ReloadOutlined,
  WarningOutlined
} from '@ant-design/icons';
import { killProcess } from '../utils/fileUtils';
import showNotification from '../../../renderer/utils/notification';

const { confirm } = Modal;
const { Text } = Typography;

const ProcessList = ({ processes, selectedPath, loading, onProcessKilled }) => {
  const [killingProcessId, setKillingProcessId] = useState(null);

  const showConfirm = (processId, processName) => {
    confirm({
      title: '确认结束进程',
      icon: <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />,
      content: (
        <div>
          <p>确定要结束进程 <Text strong>"{processName}"</Text> (PID: {processId})？</p>
          <p><WarningOutlined style={{ color: '#faad14' }} /> 这可能导致相关应用程序不稳定或数据丢失。</p>
        </div>
      ),
      okText: '结束进程',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        await handleKillProcess(processId, processName);
      }
    });
  };

  const handleKillProcess = async (processId, processName) => {
    try {
      setKillingProcessId(processId);
      await killProcess(processId);
      message.success(`已结束进程 "${processName}" (PID: ${processId})`);
      showNotification('进程已结束', `已成功结束进程: ${processName} (PID: ${processId})`);
      
      if (onProcessKilled) {
        onProcessKilled(processId);
      }
    } catch (error) {
      message.error(`结束进程失败: ${error.message}`);
    } finally {
      setKillingProcessId(null);
    }
  };

  const columns = [
    {
      title: 'PID',
      dataIndex: 'Id',
      key: 'Id',
      width: '10%',
      render: (id) => <Badge status="processing" text={id} />
    },
    {
      title: '进程名',
      dataIndex: 'ProcessName',
      key: 'ProcessName',
      width: '20%',
      render: (name) => <Text strong>{name}</Text>
    },
    {
      title: '路径',
      dataIndex: 'Path',
      key: 'Path',
      width: '50%',
      ellipsis: true,
      render: (path) => (
        <Tooltip title={path} placement="topLeft">
          <Text style={{ width: '100%' }} ellipsis>{path}</Text>
        </Tooltip>
      )
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Button
          danger
          type="primary"
          icon={<StopOutlined />}
          onClick={() => showConfirm(record.Id, record.ProcessName)}
          loading={killingProcessId === record.Id}
        >
          结束进程
        </Button>
      ),
    },
  ];

  return (
    <Card 
      title={
        <Space>
          <InfoCircleOutlined />
          <span>占用进程列表{selectedPath ? ` - ${selectedPath}` : ''}</span>
        </Space>
      }
      extra={
        selectedPath && (
          <Tooltip title="刷新列表">
            <Button 
              icon={<ReloadOutlined />} 
              onClick={() => onProcessKilled()}
              disabled={loading}
            />
          </Tooltip>
        )
      }
      className="process-list-card"
      style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}
      bodyStyle={{ flex: 1, padding: '8px 24px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
    >
      <Spin spinning={loading} tip="正在检测文件占用..." style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div className="table-container" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {processes.length > 0 ? (
            <Table
              columns={columns}
              dataSource={processes}
              rowKey="Id"
              pagination={
                processes.length > 10 ? 
                { pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 个进程` } : 
                false
              }
              scroll={{ x: 'max-content' }}
              size="middle"
              style={{ flex: 1 }}
              className="process-table"
            />
          ) : (
            <Empty 
              description={
                <Text type="secondary">
                  {selectedPath ? 
                    "没有找到占用该文件/文件夹的进程" : 
                    "请先选择文件或文件夹并检查占用"
                  }
                </Text>
              }
              style={{ margin: '60px 0' }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </div>
      </Spin>
    </Card>
  );
};

export default ProcessList;
