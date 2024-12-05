import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const StateModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState("");
  const [stateDate, setStateDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setState(user.state || ""); // Default to empty if not set
      setStateDate(user.stateDate ? moment(user.stateDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      // Optimistic update
      const optimisticUser = {
        ...user,
        state,
        stateDate: stateDate ? stateDate.toISOString() : null,
      };
      onUpdate(optimisticUser); // Update parent state optimistically
  
      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        state,
        stateDate: stateDate ? stateDate.toISOString() : null,
      });
  
      message.success("State and Date updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update state. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  
  return (
    <Modal
      title="Update State"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>State:</label>
        <Input
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter new state"
        />
      </div>
      <div>
        <label>State Date:</label>
        <DatePicker
          value={stateDate}
          onChange={(date) => setStateDate(date)}
          style={{ width: "100%" }}
          placeholder="Select state date"
        />
      </div>
    </Modal>
  );
};

export default StateModal;
