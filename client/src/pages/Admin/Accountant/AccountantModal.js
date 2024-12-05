import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import axios from 'axios';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AccountantModal = ({ visible, onClose, fetchAccountants }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      await axios.post(`${apiUrl}/api/users`, { ...values, role: 'accountant' });
      message.success('Accountant created successfully');
      fetchAccountants();
      onClose();
      form.resetFields();
    } catch (error) {
      message.error('Failed to create accountant');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={visible}
      title="Add Accountant"
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="uid"
          label="ID"
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input placeholder="Enter accountant ID" />
        </Form.Item>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter the name' }]}
        >
          <Input placeholder="Enter accountant name" />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter the email' }]}
        >
          <Input type="email" placeholder="Enter accountant email" />
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{ required: true, message: 'Please enter the password' }]}
        >
          <Input placeholder="Enter accountant password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AccountantModal;
