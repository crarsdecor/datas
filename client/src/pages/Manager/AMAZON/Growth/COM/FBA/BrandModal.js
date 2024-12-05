import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const BrandModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [brandNameDate, setBrandNameDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setBrandName(user.brandName || ""); // Set initial value for brandName
      setBrandNameDate(
        user.brandNameDate ? moment(user.brandNameDate) : null
      ); // Set initial value for brandNameDate
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        brandName,
        brandNameDate: brandNameDate ? brandNameDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        brandName: optimisticUser.brandName,
        brandNameDate: optimisticUser.brandNameDate,
      });

      message.success("Brand details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update brand details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Brand Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Brand Name:</label>
        <Input
          value={brandName}
          onChange={(e) => setBrandName(e.target.value)}
          placeholder="Enter brand name"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Brand Name Date:</label>
        <DatePicker
          value={brandNameDate}
          onChange={(date) => setBrandNameDate(date)}
          style={{ width: "100%" }}
          placeholder="Select brand name date"
        />
      </div>
    </Modal>
  );
};

export default BrandModal;
