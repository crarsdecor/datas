import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, Button, message, DatePicker } from 'antd';
import axios from 'axios';

const { Option } = Select;

const UserModal = ({ visible, onClose, fetchUsers, managers }) => {
  const [loading, setLoading] = useState(false);

  const handleCreateUser = async (values) => {
    try {
      setLoading(true);
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users`, {
        ...values,
        role: 'user',
      });
      message.success('User created successfully');
      fetchUsers();
      onClose();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Add New User"
      open={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form layout="vertical" onFinish={handleCreateUser}>
        <Form.Item
          name="uid"
          label="UID"
          rules={[{ required: true, message: 'UID is required' }]}
        >
          <Input placeholder="Enter UID" />
        </Form.Item>
        <Form.Item
          name="enrollmentIdAmazon"
          label="Enrollment ID AMAZON"
        >
          <Input placeholder="Enter Enrollment ID AMAZON" />
        </Form.Item>
        <Form.Item
  name="dateAmazon"
  label="Date (AMAZON)"
>
  <DatePicker placeholder="Select date" style={{ width: '100%' }} />
</Form.Item>
        <Form.Item
          name="enrollmentIdWebsite"
          label="Enrollment ID WEBSITE"
        >
          <Input placeholder="Enter Enrollment ID WEBSITE" />
        </Form.Item>
        <Form.Item
          name="dateWebsite"
          label="Date (WEBSITE)"
        >
          <DatePicker placeholder="Select date" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="name"
          label="User Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input placeholder="Enter user name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="User Email"
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input placeholder="Enter user email" />
        </Form.Item>
        <Form.Item
          name="primaryContact"
          label="Primary Contact"
          rules={[{ required: true, message: 'Primary Contact is required' }]}
        >
          <Input placeholder="Enter Contact" />
        </Form.Item>
        <Form.Item
          name="secondaryContact"
          label="Secondary Contact"
        >
          <Input placeholder="Enter Contact" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Password is required' }]}
        >
          <Input placeholder="Enter password" />
        </Form.Item>
        <Form.Item
          name="batchWebsite"
          label="Batch (WEBSITE)"
        >
          <Input placeholder="Enter batch" />
        </Form.Item>
        <Form.Item
          name="batchAmazon"
          label="Batch (AMAZON)"
        >
          <Input placeholder="Enter batch" />
        </Form.Item>
        <Form.Item
          name="managerIds"
          label="Assign Managers"
          rules={[{ required: true, message: 'At least one manager is required' }]}
        >
          <Select
            mode="multiple"
            placeholder="Select managers"
            style={{ width: '100%' }}
          >
            {managers.map((manager) => (
              <Option key={manager._id} value={manager._id}>
                {manager.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Add User
        </Button>
      </Form>
    </Modal>
  );
};

export default UserModal;
