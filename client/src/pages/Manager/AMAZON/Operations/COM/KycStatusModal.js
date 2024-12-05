import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const KycStatusModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState("Done");
  const [kycStatusDate, setKycStatusDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setKycStatus(user.kycStatus || "Done"); // Set initial value for kycStatus
      setKycStatusDate(
        user.kycStatusDate ? moment(user.kycStatusDate) : null
      ); // Set initial value for kycStatusDate
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        kycStatus,
        kycStatusDate: kycStatusDate ? kycStatusDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        kycStatus: optimisticUser.kycStatus,
        kycStatusDate: optimisticUser.kycStatusDate,
      });

      message.success("KYC Status updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update KYC status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update KYC Status"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>KYC Status:</label>
        <Select
          value={kycStatus}
          onChange={(value) => setKycStatus(value)}
          style={{ width: "100%" }}
        >
          <Select.Option value="Done">Done</Select.Option>
          <Select.Option value="Pending">Pending</Select.Option>
          <Select.Option value="Rejected">Rejected</Select.Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>KYC Status Date:</label>
        <DatePicker
          value={kycStatusDate}
          onChange={(date) => setKycStatusDate(date)}
          style={{ width: "100%" }}
          placeholder="Select KYC status date"
        />
      </div>
    </Modal>
  );
};

export default KycStatusModal;
