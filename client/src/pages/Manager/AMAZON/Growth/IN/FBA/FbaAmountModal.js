import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const FbaAmountModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fbaAmountIn, setFbaAmountIn] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setFbaAmountIn(user.fbaAmountIn || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        fbaAmountIn,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        fbaAmountIn,
      });

      message.success("FBA Amount updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update FBA Amount. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update FBA Amount"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>FBA Amount In:</label>
        <Input
          value={fbaAmountIn}
          onChange={(e) => setFbaAmountIn(e.target.value)}
          placeholder="Enter FBA Amount"
        />
      </div>
    </Modal>
  );
};

export default FbaAmountModal;
