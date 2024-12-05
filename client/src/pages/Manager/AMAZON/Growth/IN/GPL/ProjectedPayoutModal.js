import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ProjectedPayoutModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [projectedPayoutIn, setProjectedPayoutIn] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setProjectedPayoutIn(user.projectedPayoutIn || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        projectedPayoutIn,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        projectedPayoutIn,
      });

      message.success("Projected Payout updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update Projected Payout. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Projected Payout"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>Projected Payout:</label>
        <Input
          value={projectedPayoutIn}
          onChange={(e) => setProjectedPayoutIn(e.target.value)}
          placeholder="Enter projected payout value"
        />
      </div>
    </Modal>
  );
};

export default ProjectedPayoutModal;
