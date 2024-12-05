import React, { useState, useEffect } from "react";
import { Modal, Input, DatePicker, Switch, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage1PaymentModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [date, setDate] = useState(null);
  const [status, setStatus] = useState(false);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user?.stage1) {
      setAmount(user.stage1.amount || "");
      setPaymentMode(user.stage1.paymentMode || "");
      setDate(user.stage1.date ? moment(user.stage1.date) : null);
      setStatus(user.stage1.status === "Done");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      const updatedUser = {
        ...user,
        stage1: {
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
        stage1: updatedUser.stage1,
      });
  
      message.success("Stage 1 Payment updated successfully.");
      onUpdate(data); // Update with server response (if needed)
    } catch (error) {
      message.error("Failed to update Stage 1 Payment. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  

  return (
    <Modal
      title="Update Stage 1 Payment"
      visible={visible}
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

export default Stage1PaymentModal;
