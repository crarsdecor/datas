import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const WebsiteIdPassModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [websiteId, setWebsiteId] = useState("");
  const [websitePass, setWebsitePass] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setWebsiteId(user.websiteId || ""); // Load websiteId from user data
      setWebsitePass(user.websitePass || ""); // Load websitePass from user data
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        websiteId,
        websitePass,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        websiteId,
        websitePass,
      });

      message.success("Website ID and Password updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Website ID and Password. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Website ID and Password"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Website ID:</label>
        <Input
          value={websiteId}
          onChange={(e) => setWebsiteId(e.target.value)}
          placeholder="Enter Website ID"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Website Password:</label>
        <Input.Password
          value={websitePass}
          onChange={(e) => setWebsitePass(e.target.value)}
          placeholder="Enter Website Password"
        />
      </div>
    </Modal>
  );
};

export default WebsiteIdPassModal;
