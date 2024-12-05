import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const OvcModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [ovc, setOvc] = useState(false);
  const [ovcDate, setOvcDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setOvc(user.ovc === "Done"); // Map "Done" to true and others to false
      setOvcDate(user.ovcDate ? moment(user.ovcDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      // Optimistic update
      const optimisticUser = {
        ...user,
        ovc: ovc ? "Done" : "Not Done",
        ovcDate: ovcDate ? ovcDate.toISOString() : null,
      };
      onUpdate(optimisticUser);
  
      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        ovc: optimisticUser.ovc,
        ovcDate: optimisticUser.ovcDate,
      });
  
      message.success("OVC status and date updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update OVC status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  

  return (
    <Modal
      title="Update OVC Status"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={ovc}
          onChange={(checked) => setOvc(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div>
        <label>Date:</label>
        <DatePicker
          value={ovcDate}
          onChange={(date) => setOvcDate(date)}
          style={{ width: "100%" }}
          placeholder="Select OVC date"
        />
      </div>
    </Modal>
  );
};

export default OvcModal;
