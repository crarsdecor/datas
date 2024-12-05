import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage2CompletionModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [stage2Completion, setStage2Completion] = useState(false);
  const [stage2CompletionDate, setStage2CompletionDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setStage2Completion(user.stage2Completion === "Done"); // Map "Done" to true and others to false
      setStage2CompletionDate(user.stage2CompletionDate ? moment(user.stage2CompletionDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        stage2Completion: stage2Completion ? "Done" : "Not Done",
        stage2CompletionDate: stage2CompletionDate ? stage2CompletionDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        stage2Completion: optimisticUser.stage2Completion,
        stage2CompletionDate: optimisticUser.stage2CompletionDate,
      });

      message.success("Stage 2 Completion details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Stage 2 Completion details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Stage 2 Completion"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Stage 2 Completion:</label>
        <Switch
          checked={stage2Completion}
          onChange={(checked) => setStage2Completion(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Completion Date:</label>
        <DatePicker
          value={stage2CompletionDate}
          onChange={(date) => setStage2CompletionDate(date)}
          style={{ width: "100%" }}
          placeholder="Select completion date"
        />
      </div>
    </Modal>
  );
};

export default Stage2CompletionModal;
