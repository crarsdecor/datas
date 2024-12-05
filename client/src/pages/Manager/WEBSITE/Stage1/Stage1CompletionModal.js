import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage1CompletionModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [stage1Completion, setStage1Completion] = useState(false);
  const [stage1CompletionDate, setStage1CompletionDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setStage1Completion(user.stage1Completion === "Done"); // Map "Done" to true and others to false
      setStage1CompletionDate(user.stage1CompletionDate ? moment(user.stage1CompletionDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        stage1Completion: stage1Completion ? "Done" : "Not Done",
        stage1CompletionDate: stage1CompletionDate ? stage1CompletionDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        stage1Completion: optimisticUser.stage1Completion,
        stage1CompletionDate: optimisticUser.stage1CompletionDate,
      });

      message.success("Stage 1 Completion details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Stage 1 Completion details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Stage 1 Completion"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Stage 1 Completion:</label>
        <Switch
          checked={stage1Completion}
          onChange={(checked) => setStage1Completion(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Completion Date:</label>
        <DatePicker
          value={stage1CompletionDate}
          onChange={(date) => setStage1CompletionDate(date)}
          style={{ width: "100%" }}
          placeholder="Select completion date"
        />
      </div>
    </Modal>
  );
};

export default Stage1CompletionModal;
