import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AccountStatusModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [accountStatusIn, setAccountStatusIn] = useState(null);
  const [accountStatusInDate, setAccountStatusInDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setAccountStatusIn(user.accountStatusIn || null); // Set initial value for dropdown
      setAccountStatusInDate(
        user.accountStatusInDate ? moment(user.accountStatusInDate) : null
      ); // Set initial value for date picker
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        accountStatusIn,
        accountStatusInDate: accountStatusInDate
          ? accountStatusInDate.toISOString()
          : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        accountStatusIn: optimisticUser.accountStatusIn,
        accountStatusInDate: optimisticUser.accountStatusInDate,
      });

      message.success("Account status details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update account status details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Account Status Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Account Status:</label>
        <Select
          value={accountStatusIn}
          onChange={(value) => setAccountStatusIn(value)}
          style={{ width: "100%" }}
          placeholder="Select account status"
        >
          <Option value="Writing For Approval">Writing For Approval</Option>
          <Option value="Approved">Approved</Option>
          <Option value="Declined">Declined</Option>
          <Option value="Generic">Generic</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Account Status Date:</label>
        <DatePicker
          value={accountStatusInDate}
          onChange={(date) => setAccountStatusInDate(date)}
          style={{ width: "100%" }}
          placeholder="Select account status date"
        />
      </div>
    </Modal>
  );
};

export default AccountStatusModal;
