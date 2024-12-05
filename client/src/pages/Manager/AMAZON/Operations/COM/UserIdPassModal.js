import React, { useState, useEffect } from "react";
import { Modal, Input, message } from "antd";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const UserIdPassModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [amazonIdCom, setAmazonIdCom] = useState("");
  const [amazonPassCom, setAmazonPassCom] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setAmazonIdCom(user.amazonIdCom || "");
      setAmazonPassCom(user.amazonPassCom || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        amazonIdCom,
        amazonPassCom,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        amazonIdCom: optimisticUser.amazonIdCom,
        amazonPassCom: optimisticUser.amazonPassCom,
      });

      message.success("Amazon ID and Password updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update user details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Amazon ID and Password"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Amazon ID:</label>
        <Input
          value={amazonIdCom}
          onChange={(e) => setAmazonIdCom(e.target.value)}
          placeholder="Enter Amazon ID"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Password:</label>
        <Input.Password
          value={amazonPassCom}
          onChange={(e) => setAmazonPassCom(e.target.value)}
          placeholder="Enter Password"
        />
      </div>
    </Modal>
  );
};

export default UserIdPassModal;
