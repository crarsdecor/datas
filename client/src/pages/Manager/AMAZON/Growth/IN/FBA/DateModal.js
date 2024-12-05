import React, { useState, useEffect } from "react";
import { Modal, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const DateModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [dateFbaIn, setDateFbaIn] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setDateFbaIn(user.dateFbaIn ? moment(user.dateFbaIn) : null); // Default to null if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        dateFbaIn: dateFbaIn ? dateFbaIn.toISOString() : null,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        dateFbaIn: dateFbaIn ? dateFbaIn.toISOString() : null,
      });

      message.success("FBA date updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update FBA date. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update FBA Date"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>FBA Date:</label>
        <DatePicker
          value={dateFbaIn}
          onChange={(date) => setDateFbaIn(date)}
          style={{ width: "100%" }}
          placeholder="Select FBA date"
        />
      </div>
    </Modal>
  );
};

export default DateModal;
