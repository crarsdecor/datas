import React from 'react';
import { Modal, Form, Input, Button } from 'antd';

const AddManagerModal = ({ visible, onClose, onCreate, loading }) => {
  const [form] = Form.useForm();

  const handleOk = () => {
    form.validateFields()
      .then((values) => {
        form.resetFields();
        onCreate(values);
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  return (
    <Modal
      title="Add Manager"
      visible={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
          Add
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical" name="add_manager_form">
        <Form.Item name="name" label="Name" rules={[{ required: true, message: 'Please enter the manager name' }]}>
          <Input placeholder="Enter manager name" />
        </Form.Item>
        <Form.Item name="uid" label="Position" rules={[{ required: true, message: 'Please enter the manager position' }]}>
          <Input placeholder="Enter manager position" />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter the manager email' }]}>
          <Input placeholder="Enter manager email" />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter a password' }]}>
          <Input.Password placeholder="Enter password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddManagerModal;
