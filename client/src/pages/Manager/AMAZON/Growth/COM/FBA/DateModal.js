import React, { useState, useEffect } from "react";
import { Modal, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const DateModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [dateFbaCom, setDateFbaCom] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setDateFbaCom(user.dateFbaCom ? moment(user.dateFbaCom) : null); // Default to null if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        dateFbaCom: dateFbaCom ? dateFbaCom.toISOString() : null,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        dateFbaCom: dateFbaCom ? dateFbaCom.toISOString() : null,
      });

      message.success("FBA Completion Date updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update FBA Completion Date. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update FBA Completion Date"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>FBA Completion Date:</label>
        <DatePicker
          value={dateFbaCom}
          onChange={(date) => setDateFbaCom(date)}
          style={{ width: "100%" }}
          placeholder="Select FBA Completion Date"
        />
      </div>
    </Modal>
  );
};

export default DateModal;
