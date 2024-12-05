import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const DomainMailVerificationModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [domainMailVerification, setDomainMailVerification] = useState(false);
  const [domainMailVerificationDate, setDomainMailVerificationDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setDomainMailVerification(user.domainMailVerification === "Done"); // Map "Done" to true and others to false
      setDomainMailVerificationDate(
        user.domainMailVerificationDate ? moment(user.domainMailVerificationDate) : null
      );
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        domainMailVerification: domainMailVerification ? "Done" : "Not Done",
        domainMailVerificationDate: domainMailVerificationDate
          ? domainMailVerificationDate.toISOString()
          : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        domainMailVerification: optimisticUser.domainMailVerification,
        domainMailVerificationDate: optimisticUser.domainMailVerificationDate,
      });

      message.success("Domain Mail Verification details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Domain Mail Verification details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Domain Mail Verification Details"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={domainMailVerification}
          onChange={(checked) => setDomainMailVerification(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={domainMailVerificationDate}
          onChange={(date) => setDomainMailVerificationDate(date)}
          style={{ width: "100%" }}
          placeholder="Select Domain Mail Verification Date"
        />
      </div>
    </Modal>
  );
};

export default DomainMailVerificationModal;
