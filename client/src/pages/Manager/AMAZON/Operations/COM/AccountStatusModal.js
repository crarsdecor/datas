import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AccountStatusModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [accountStatusCom, setAccountStatusCom] = useState(null);
  const [accountStatusComDate, setAccountStatusComDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setAccountStatusCom(user.accountStatusCom || null); // Set initial value for dropdown
      setAccountStatusComDate(
        user.accountStatusComDate ? moment(user.accountStatusComDate) : null
      ); // Set initial value for date picker
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        accountStatusCom,
        accountStatusComDate: accountStatusComDate
          ? accountStatusComDate.toISOString()
          : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        accountStatusCom: optimisticUser.accountStatusCom,
        accountStatusComDate: optimisticUser.accountStatusComDate,
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
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Account Status:</label>
        <Select
          value={accountStatusCom}
          onChange={(value) => setAccountStatusCom(value)}
          style={{ width: "100%" }}
          placeholder="Select account status"
        >
          <Option value="NIA Run">NIA Run</Option>
          <Option value="Credit Limit Receive Date">Credit Limit Receive Date</Option>
          <Option value="Ads Active">Ads Active</Option>
          <Option value="Ads Pause">Ads Pause</Option>
          <Option value="Deactivated">Deactivated</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Account Status Date:</label>
        <DatePicker
          value={accountStatusComDate}
          onChange={(date) => setAccountStatusComDate(date)}
          style={{ width: "100%" }}
          placeholder="Select account status date"
        />
      </div>
    </Modal>
  );
};

export default AccountStatusModal;
