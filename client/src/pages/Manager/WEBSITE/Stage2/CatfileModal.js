import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const CatfileModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [catFile, setCatFile] = useState(false);
  const [catFileDate, setCatFileDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setCatFile(user.catFile === "Done"); // Map "Done" to true and others to false
      setCatFileDate(user.catFileDate ? moment(user.catFileDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        catFile: catFile ? "Done" : "Not Done",
        catFileDate: catFileDate ? catFileDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        catFile: optimisticUser.catFile,
        catFileDate: optimisticUser.catFileDate,
      });

      message.success("CAT File status updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update CAT File status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update CAT File Status"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={catFile}
          onChange={(checked) => setCatFile(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={catFileDate}
          onChange={(date) => setCatFileDate(date)}
          style={{ width: "100%" }}
          placeholder="Select CAT File date"
        />
      </div>
    </Modal>
  );
};

export default CatfileModal;
