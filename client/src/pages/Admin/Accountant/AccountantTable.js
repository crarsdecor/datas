import React from 'react';
import { Table, Button, Popconfirm } from 'antd';

const AccountantTable = ({ accountants, handleDeleteAccountant }) => {
  const columns = [
    {
      title: 'ID',
      dataIndex: 'uid',
      key: 'uid',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Password',
      dataIndex: 'password',
      key: 'password',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Popconfirm
          title="Are you sure to delete this accountant?"
          onConfirm={() => handleDeleteAccountant(record.id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  return <Table dataSource={accountants} columns={columns} rowKey="id" />;
};

export default AccountantTable;
