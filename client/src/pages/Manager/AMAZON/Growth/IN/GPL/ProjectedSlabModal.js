import React, { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ProjectedSlabModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [projectedSlabIn, setProjectedSlabIn] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setProjectedSlabIn(user.projectedSlabIn || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        projectedSlabIn,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        projectedSlabIn,
      });

      message.success("Projected Slab updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update Projected Slab. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Projected Slab"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>Projected Slab:</label>
        <Select
          value={projectedSlabIn}
          onChange={(value) => setProjectedSlabIn(value)}
          style={{ width: "100%" }}
          placeholder="Select Projected Slab"
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

export default ProjectedSlabModal;
