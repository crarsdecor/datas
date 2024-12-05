import React, { useState, useEffect } from "react";
import { Modal, Select, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const { Option } = Select;
const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ThemeModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState("");
  const [themeStatus, setThemeStatus] = useState("");
  const [themeDate, setThemeDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setTheme(user.theme || "");
      setThemeStatus(user.themeStatus || "");
      setThemeDate(user.themeDate ? moment(user.themeDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        theme,
        themeStatus,
        themeDate: themeDate ? themeDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        theme,
        themeStatus,
        themeDate: themeDate ? themeDate.toISOString() : null,
      });

      message.success("Theme details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update theme details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Theme Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Theme:</label>
        <Select
          value={theme}
          onChange={(value) => setTheme(value)}
          style={{ width: "100%" }}
          placeholder="Select theme"
        >
          <Option value="Theme 1">Theme 1</Option>
          <Option value="Theme 2">Theme 2</Option>
          <Option value="Theme 3">Theme 3</Option>
          <Option value="Theme 4">Theme 4</Option>
          <Option value="Theme 5">Theme 5</Option>
          <Option value="Theme 6">Theme 6</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Theme Status:</label>
        <Select
          value={themeStatus}
          onChange={(value) => setThemeStatus(value)}
          style={{ width: "100%" }}
          placeholder="Select status"
        >
          <Option value="Sent">Sent</Option>
          <Option value="Approved">Approved</Option>
        </Select>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Theme Date:</label>
        <DatePicker
          value={themeDate}
          onChange={(date) => setThemeDate(date)}
          style={{ width: "100%" }}
          placeholder="Select theme date"
        />
      </div>
    </Modal>
  );
};

export default ThemeModal;
