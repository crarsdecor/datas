import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const GalleryModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState(false);
  const [galleryDate, setGalleryDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setGallery(user.gallery === "Done"); // Map "Done" to true and others to false
      setGalleryDate(user.galleryDate ? moment(user.galleryDate) : null);
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        gallery: gallery ? "Done" : "Not Done",
        galleryDate: galleryDate ? galleryDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call to update the user data
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        gallery: optimisticUser.gallery,
        galleryDate: optimisticUser.galleryDate,
      });

      message.success("Gallery status updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update Gallery status. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Gallery Status"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={gallery}
          onChange={(checked) => setGallery(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Date:</label>
        <DatePicker
          value={galleryDate}
          onChange={(date) => setGalleryDate(date)}
          style={{ width: "100%" }}
          placeholder="Select Gallery date"
        />
      </div>
    </Modal>
  );
};

export default GalleryModal;
