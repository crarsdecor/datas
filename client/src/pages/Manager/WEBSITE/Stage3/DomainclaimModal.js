import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const DomainClaimModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [domainClaim, setDomainClaim] = useState("");
  const [domainClaimDate, setDomainClaimDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setDomainClaim(user.domainClaim || "");
      setDomainClaimDate(user.domainClaimDate ? moment(user.domainClaimDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        domainClaim,
        domainClaimDate: domainClaimDate ? domainClaimDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        domainClaim: optimisticUser.domainClaim,
        domainClaimDate: optimisticUser.domainClaimDate,
      });

      message.success("Domain Claim details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Domain Claim details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Domain Claim Details"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Domain Claim:</label>
        <Input
          value={domainClaim}
          onChange={(e) => setDomainClaim(e.target.value)}
          placeholder="Enter Domain Claim"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={domainClaimDate}
          onChange={(date) => setDomainClaimDate(date)}
          style={{ width: "100%" }}
          placeholder="Select Domain Claim Date"
        />
      </div>
    </Modal>
  );
};

export default DomainClaimModal;
