import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AccountStatusModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [accountStatusGplIn, setAccountStatusGplIn] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setAccountStatusGplIn(user.accountStatusGplIn || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        accountStatusGplIn,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        accountStatusGplIn,
      });

      message.success("Account Status updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update Account Status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Account Status"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>Account Status:</label>
        <Input
          value={accountStatusGplIn}
          onChange={(e) => setAccountStatusGplIn(e.target.value)}
          placeholder="Enter account status"
        />
      </div>
    </Modal>
  );
};

export default AccountStatusModal;
