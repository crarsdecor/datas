import React, { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ApobModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [apobIn, setApobIn] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setApobIn(user.apobIn || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        apobIn,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        apobIn,
      });

      message.success("APOB updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update APOB. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update APOB"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>APOB:</label>
        <Select
          value={apobIn}
          onChange={(value) => setApobIn(value)}
          style={{ width: "100%" }}
          placeholder="Select APOB"
        >
          <Option value="Done">Done</Option>
          <Option value="Not Done">Not Done</Option>
          <Option value="Pending">Pending</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default ApobModal;
