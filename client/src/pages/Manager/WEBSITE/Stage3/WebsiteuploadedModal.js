import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const WebsiteUploadedModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [websiteUploaded, setWebsiteUploaded] = useState(false);
  const [websiteUploadedDate, setWebsiteUploadedDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setWebsiteUploaded(user.websiteUploaded === "Done"); // Map "Done" to true and others to false
      setWebsiteUploadedDate(
        user.websiteUploadedDate ? moment(user.websiteUploadedDate) : null
      );
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        websiteUploaded: websiteUploaded ? "Done" : "Not Done",
        websiteUploadedDate: websiteUploadedDate
          ? websiteUploadedDate.toISOString()
          : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        websiteUploaded: optimisticUser.websiteUploaded,
        websiteUploadedDate: optimisticUser.websiteUploadedDate,
      });

      message.success("Website Uploaded details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Website Uploaded details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Website Uploaded Details"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={websiteUploaded}
          onChange={(checked) => setWebsiteUploaded(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={websiteUploadedDate}
          onChange={(date) => setWebsiteUploadedDate(date)}
          style={{ width: "100%" }}
          placeholder="Select Website Uploaded Date"
        />
      </div>
    </Modal>
  );
};

export default WebsiteUploadedModal;
