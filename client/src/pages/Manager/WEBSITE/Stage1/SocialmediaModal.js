import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const SocialmediaModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [socialMediaContent, setSocialMediaContent] = useState(false);
  const [socialMediaContentDate, setSocialMediaContentDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setSocialMediaContent(user.socialMediaContent === "Done"); // Map "Done" to true and others to false
      setSocialMediaContentDate(
        user.socialMediaContentDate ? moment(user.socialMediaContentDate) : null
      );
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        socialMediaContent: socialMediaContent ? "Done" : "Not Done",
        socialMediaContentDate: socialMediaContentDate
          ? socialMediaContentDate.toISOString()
          : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        socialMediaContent: optimisticUser.socialMediaContent,
        socialMediaContentDate: optimisticUser.socialMediaContentDate,
      });

      message.success("Social Media Content status updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Social Media Content status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Social Media Content Status"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={socialMediaContent}
          onChange={(checked) => setSocialMediaContent(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={socialMediaContentDate}
          onChange={(date) => setSocialMediaContentDate(date)}
          style={{ width: "100%" }}
          placeholder="Select content date"
        />
      </div>
    </Modal>
  );
};

export default SocialmediaModal;
