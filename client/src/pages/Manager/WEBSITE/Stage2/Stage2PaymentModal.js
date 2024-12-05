import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Switch, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage2PaymentModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState(false);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user?.stage2) {
      setAmount(user.stage2.amount || "");
      setPaymentMode(user.stage2.paymentMode || "");
      setDate(user.stage2.date ? moment(user.stage2.date) : null);
      setStatus(user.stage2.status === "Done");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      const updatedUser = {
        ...user,
        stage2: {
          amount,
          paymentMode,
          date: date ? date.toISOString() : null,
          status: status ? "Done" : "Not Done",
        },
      };
  
      // Optimistically update the parent
      onUpdate(updatedUser);
  
      // Send API request
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        stage2: updatedUser.stage2,
      });
  
      message.success("Stage 2 Payment updated successfully.");
      onUpdate(data); // Update with server response (if needed)
    } catch (error) {
      message.error("Failed to update Stage 2 Payment. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  

  return (
    <Modal
      title="Update Stage 2 Payment"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Amount:</label>
        <Input
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter payment amount"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Payment Mode:</label>
        <Input
          value={paymentMode}
          onChange={(e) => setPaymentMode(e.target.value)}
          placeholder="Enter payment mode"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={date}
          onChange={(selectedDate) => setDate(selectedDate)}
          style={{ width: "100%" }}
          placeholder="Select payment date"
        />
      </div>
      <div>
        <label>Status:</label>
        <Switch
          checked={status}
          onChange={(checked) => setStatus(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
    </Modal>
  );
};

export default Stage2PaymentModal;
