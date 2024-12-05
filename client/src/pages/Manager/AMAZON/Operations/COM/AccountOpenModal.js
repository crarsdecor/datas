import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AccountOpenModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [accountOpenCom, setAccountOpenCom] = useState("Not Opened");
  const [accountOpenComDate, setAccountOpenComDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setAccountOpenCom(user.accountOpenCom || "Not Opened"); // Set initial value for accountOpenCom
      setAccountOpenComDate(
        user.accountOpenComDate ? moment(user.accountOpenComDate) : null
      ); // Set initial value for accountOpenComDate
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        accountOpenCom,
        accountOpenComDate: accountOpenComDate ? accountOpenComDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        accountOpenCom: optimisticUser.accountOpenCom,
        accountOpenComDate: optimisticUser.accountOpenComDate,
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
        <label>Account Open:</label>
        <Select
          value={accountOpenCom}
          onChange={(value) => setAccountOpenCom(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Opened">Opened</Select.Option>
          <Select.Option value="Not Opened">Not Opened</Select.Option>
          <Select.Option value="Already">Already</Select.Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Account Open Date:</label>
        <DatePicker
          value={accountOpenComDate}
          onChange={(date) => setAccountOpenComDate(date)}
          style={{ width: "100%" }}
          placeholder="Select account open date"
        />
      </div>
    </Modal>
  );
};

export default AccountOpenModal;
