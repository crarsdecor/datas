import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AccountOpenModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [accountOpenIn, setAccountOpenIn] = useState(null);
  const [accountOpenInDate, setAccountOpenInDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setAccountOpenIn(user.accountOpenIn || null); // Set initial value for dropdown
      setAccountOpenInDate(
        user.accountOpenInDate ? moment(user.accountOpenInDate) : null
      ); // Set initial value for date picker
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        accountOpenIn,
        accountOpenInDate: accountOpenInDate
          ? accountOpenInDate.toISOString()
          : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        accountOpenIn: optimisticUser.accountOpenIn,
        accountOpenInDate: optimisticUser.accountOpenInDate,
      });

      message.success("Account open details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update account open details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Account Open Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Account Open Status:</label>
        <Select
          value={accountOpenIn}
          onChange={(value) => setAccountOpenIn(value)}
          style={{ width: "100%" }}
          placeholder="Select account open status"
        >
          <Option value="Opened">Opened</Option>
          <Option value="Not Opened">Not Opened</Option>
          <Option value="Already">Already</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Account Open Date:</label>
        <DatePicker
          value={accountOpenInDate}
          onChange={(date) => setAccountOpenInDate(date)}
          style={{ width: "100%" }}
          placeholder="Select account open date"
        />
      </div>
    </Modal>
  );
};

export default AccountOpenModal;
