import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, Input, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ServerpurchaseModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [serverPurchase, setServerPurchase] = useState(false);
  const [serverPurchaseDate, setServerPurchaseDate] = useState(null);
  const [serverId, setServerId] = useState("");
  const [serverPass, setServerPass] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setServerPurchase(user.serverPurchase === "Done"); // Map "Done" to true and others to false
      setServerPurchaseDate(user.serverPurchaseDate ? moment(user.serverPurchaseDate) : null);
      setServerId(user.serverId || "");
      setServerPass(user.serverPass || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        serverPurchase: serverPurchase ? "Done" : "Not Done",
        serverPurchaseDate: serverPurchaseDate ? serverPurchaseDate.toISOString() : null,
        serverId,
        serverPass,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        serverPurchase: optimisticUser.serverPurchase,
        serverPurchaseDate: optimisticUser.serverPurchaseDate,
        serverId: optimisticUser.serverId,
        serverPass: optimisticUser.serverPass,
      });

      message.success("Server Purchase details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Server Purchase details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Server Purchase Details"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={serverPurchase}
          onChange={(checked) => setServerPurchase(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={serverPurchaseDate}
          onChange={(date) => setServerPurchaseDate(date)}
          style={{ width: "100%" }}
          placeholder="Select Server Purchase Date"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Server ID:</label>
        <Input
          value={serverId}
          onChange={(e) => setServerId(e.target.value)}
          placeholder="Enter Server ID"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Server Password:</label>
        <Input.Password
          value={serverPass}
          onChange={(e) => setServerPass(e.target.value)}
          placeholder="Enter Server Password"
        />
      </div>
    </Modal>
  );
};

export default ServerpurchaseModal;
