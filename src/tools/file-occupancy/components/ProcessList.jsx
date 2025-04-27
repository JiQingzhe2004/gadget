import React, { useState } from 'react';
import { Table, Button, Card, message, Modal, Empty, Spin } from 'antd';
import { ExclamationCircleOutlined, StopOutlined } from '@ant-design/icons';
import { killProcess } from '../utils/fileUtils';
import showNotification from '../../../renderer/utils/notification';

const { confirm } = Modal;

const ProcessList = ({ processes, selectedPath, loading, onProcessKilled }) => {
  const [killingProcessId, setKillingProcessId] = useState(null);

  const showConfirm = (processId, processName) => {
    confirm({
      title: '确认结束进程',
      icon: <ExclamationCircleOutlined />,
      content: `确定要结束进程 "${processName}" (PID: ${processId})？这可能导致相关应用程序不稳定。`,
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
    },
    {
      title: '进程名',
      dataIndex: 'ProcessName',
      key: 'ProcessName',
      width: '20%',
    },
    {
      title: '路径',
      dataIndex: 'Path',
      key: 'Path',
      width: '50%',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: '20%',
      render: (_, record) => (
        <Button
          danger
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
      title={`占用进程列表 ${selectedPath ? `- ${selectedPath}` : ''}`} 
      className="process-list-card"
    >
      <Spin spinning={loading}>
        {processes.length > 0 ? (
          <Table
            columns={columns}
            dataSource={processes}
            rowKey="Id"
            pagination={false}
            scroll={{ y: 300 }}
          />
        ) : (
          <Empty 
            description={selectedPath ? "没有找到占用该文件/文件夹的进程" : "请先选择文件或文件夹并检查占用"} 
            style={{ margin: '40px 0' }}
          />
        )}
      </Spin>
    </Card>
  );
};

export default ProcessList;
