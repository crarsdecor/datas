import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const IdcardModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [idCard, setIdCard] = useState(false);
  const [idCardDate, setIdCardDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setIdCard(user.idCard === "Done"); // Map "Done" to true and others to false
      setIdCardDate(user.idCardDate ? moment(user.idCardDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        idCard: idCard ? "Done" : "Not Done",
        idCardDate: idCardDate ? idCardDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        idCard: optimisticUser.idCard,
        idCardDate: optimisticUser.idCardDate,
      });

      message.success("ID Card status updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update ID Card status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update ID Card Status"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={idCard}
          onChange={(checked) => setIdCard(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={idCardDate}
          onChange={(date) => setIdCardDate(date)}
          style={{ width: "100%" }}
          placeholder="Select ID Card date"
        />
      </div>
    </Modal>
  );
};

export default IdcardModal;
