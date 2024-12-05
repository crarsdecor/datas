import React, { useState, useEffect } from "react";
import { Modal, Switch, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const LogoModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [logo, setLogo] = useState(false);
  const [logoStatus, setLogoStatus] = useState(null);
  const [logoDate, setLogoDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setLogo(user.logo === "Done"); // Map "Done" to true and others to false
      setLogoStatus(user.logoStatus || null); // Set the logoStatus
      setLogoDate(user.logoDate ? moment(user.logoDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        logo: logo ? "Done" : "Not Done",
        logoStatus,
        logoDate: logoDate ? logoDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        logo: optimisticUser.logo,
        logoStatus: optimisticUser.logoStatus,
        logoDate: optimisticUser.logoDate,
      });

      message.success("Logo status updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update logo status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Logo Status"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={logo}
          onChange={(checked) => setLogo(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Approval Status:</label>
        <Select
          value={logoStatus}
          onChange={(value) => setLogoStatus(value)}
          style={{ width: "100%" }}
          placeholder="Select Logo Status"
        >
          <Option value="Sent">Sent</Option>
          <Option value="Approved">Approved</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={logoDate}
          onChange={(date) => setLogoDate(date)}
          style={{ width: "100%" }}
          placeholder="Select Logo date"
        />
      </div>
    </Modal>
  );
};

export default LogoModal;
