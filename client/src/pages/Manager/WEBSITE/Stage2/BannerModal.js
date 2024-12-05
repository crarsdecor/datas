import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const BannerModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState(false);
  const [bannerDate, setBannerDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setBanner(user.banner === "Done"); // Map "Done" to true and others to false
      setBannerDate(user.bannerDate ? moment(user.bannerDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        banner: banner ? "Done" : "Not Done",
        bannerDate: bannerDate ? bannerDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        banner: optimisticUser.banner,
        bannerDate: optimisticUser.bannerDate,
      });

      message.success("Banner status updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Banner status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Banner Status"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={banner}
          onChange={(checked) => setBanner(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={bannerDate}
          onChange={(date) => setBannerDate(date)}
          style={{ width: "100%" }}
          placeholder="Select Banner date"
        />
      </div>
    </Modal>
  );
};

export default BannerModal;
