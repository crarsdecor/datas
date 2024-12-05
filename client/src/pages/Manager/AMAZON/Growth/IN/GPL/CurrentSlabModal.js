import React, { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const CurrentSlabModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentSlabIn, setCurrentSlabIn] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setCurrentSlabIn(user.currentSlabIn || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        currentSlabIn,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        currentSlabIn,
      });

      message.success("Current Slab updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update Current Slab. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Current Slab"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>Current Slab:</label>
        <Select
          value={currentSlabIn}
          onChange={(value) => setCurrentSlabIn(value)}
          style={{ width: "100%" }}
          placeholder="Select Current Slab"
        >
         <Option value="15k - 25k">15k - 25k</Option>
          <Option value="25k - 50k">25k - 50k</Option>
          <Option value="50k - 1L">50k - 1L</Option>
          <Option value="1L - 3L">1L - 3L</Option>
          <Option value="3L - 5L">3L - 5L</Option>
          <Option value="5L - 10L">5L - 10L</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default CurrentSlabModal;
