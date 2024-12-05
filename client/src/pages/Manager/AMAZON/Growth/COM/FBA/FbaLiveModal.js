import React, { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const FbaLiveModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fbaLiveCom, setFbaLiveCom] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setFbaLiveCom(user.fbaLiveCom || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        fbaLiveCom,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        fbaLiveCom,
      });

      message.success("FBA Live Completion updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update FBA Live Completion. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update FBA Live Completion"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>FBA Live Completion Status:</label>
        <Select
          value={fbaLiveCom}
          onChange={(value) => setFbaLiveCom(value)}
          style={{ width: "100%" }}
          placeholder="Select FBA Live Completion status"
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default FbaLiveModal;
