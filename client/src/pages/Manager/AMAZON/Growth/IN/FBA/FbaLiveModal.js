import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const FbaLiveModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [fbaLiveIn, setFbaLiveIn] = useState("");
  const [fbaLiveInDate, setFbaLiveInDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setFbaLiveIn(user.fbaLiveIn || ""); // Default to empty if not set
      setFbaLiveInDate(user.fbaLiveInDate ? moment(user.fbaLiveInDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        fbaLiveIn,
        fbaLiveInDate: fbaLiveInDate ? fbaLiveInDate.toISOString() : null,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        fbaLiveIn,
        fbaLiveInDate: fbaLiveInDate ? fbaLiveInDate.toISOString() : null,
      });

      message.success("FBA Live details updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update FBA Live details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update FBA Live Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>FBA Live:</label>
        <Select
          value={fbaLiveIn}
          onChange={(value) => setFbaLiveIn(value)}
          style={{ width: "100%" }}
          placeholder="Select FBA Live status"
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </Select>
      </div>
      <div>
        <label>FBA Live Date:</label>
        <DatePicker
          value={fbaLiveInDate}
          onChange={(date) => setFbaLiveInDate(date)}
          style={{ width: "100%" }}
          placeholder="Select FBA Live date"
        />
      </div>
    </Modal>
  );
};

export default FbaLiveModal;
