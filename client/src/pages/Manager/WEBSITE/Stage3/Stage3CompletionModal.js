import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage3CompletionModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [stage3Completion, setStage3Completion] = useState(false);
  const [stage3CompletionDate, setStage3CompletionDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setStage3Completion(user.stage3Completion === "Done"); // Map "Done" to true and others to false
      setStage3CompletionDate(user.stage3CompletionDate ? moment(user.stage3CompletionDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        stage3Completion: stage3Completion ? "Done" : "Not Done",
        stage3CompletionDate: stage3CompletionDate ? stage3CompletionDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        stage3Completion: optimisticUser.stage3Completion,
        stage3CompletionDate: optimisticUser.stage3CompletionDate,
      });

      message.success("Stage 3 Completion details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Stage 3 Completion details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Stage 3 Completion"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Stage 3 Completion:</label>
        <Switch
          checked={stage3Completion}
          onChange={(checked) => setStage3Completion(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Completion Date:</label>
        <DatePicker
          value={stage3CompletionDate}
          onChange={(date) => setStage3CompletionDate(date)}
          style={{ width: "100%" }}
          placeholder="Select completion date"
        />
      </div>
    </Modal>
  );
};

export default Stage3CompletionModal;
