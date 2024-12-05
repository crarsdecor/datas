import React, { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const FbaRegistrationModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fbaRegistration, setFbaRegistration] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setFbaRegistration(user.fbaRegistration || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        fbaRegistration,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        fbaRegistration,
      });

      message.success("FBA Registration updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update FBA Registration. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update FBA Registration"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>FBA Registration:</label>
        <Select
          value={fbaRegistration}
          onChange={(value) => setFbaRegistration(value)}
          style={{ width: "100%" }}
          placeholder="Select FBA Registration status"
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default FbaRegistrationModal;
