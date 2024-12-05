import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AccountLaunchModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [accountLaunchIn, setAccountLaunchIn] = useState(null);
  const [accountLaunchInDate, setAccountLaunchInDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setAccountLaunchIn(user.accountLaunchIn || null); // Set initial value for accountLaunchIn
      setAccountLaunchInDate(
        user.accountLaunchInDate ? moment(user.accountLaunchInDate) : null
      ); // Set initial value for accountLaunchInDate
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        accountLaunchIn,
        accountLaunchInDate: accountLaunchInDate ? accountLaunchInDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        accountLaunchIn: optimisticUser.accountLaunchIn,
        accountLaunchInDate: optimisticUser.accountLaunchInDate,
      });

      message.success("Account launch details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update account launch details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Account Launch Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Account Launch:</label>
        <Select
          value={accountLaunchIn}
          onChange={(value) => setAccountLaunchIn(value)}
          placeholder="Select Account Launch"
        >
          <Select.Option value="Launched">Launched</Select.Option>
          <Select.Option value="Not Launched">Not Launched</Select.Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Launch Date:</label>
        <DatePicker
          value={accountLaunchInDate}
          onChange={(date) => setAccountLaunchInDate(date)}
          style={{ width: "100%" }}
          placeholder="Select launch date"
        />
      </div>
    </Modal>
  );
};

export default AccountLaunchModal;
