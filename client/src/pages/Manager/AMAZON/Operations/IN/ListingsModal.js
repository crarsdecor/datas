import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ListingsModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [listingsIn, setListingsIn] = useState("Not Done"); // Initialize as "Not Done"
  const [listingsInDate, setListingsInDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setListingsIn(user.listingsIn || "Not Done"); // Use "Done"/"Not Done" instead of boolean
      setListingsInDate(
        user.listingsInDate ? moment(user.listingsInDate) : null
      );
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        listingsIn,
        listingsInDate: listingsInDate ? listingsInDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        listingsIn: optimisticUser.listingsIn,
        listingsInDate: optimisticUser.listingsInDate,
      });

      message.success("Listings details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update listings details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Listings Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={listingsIn === "Done"}
          onChange={(checked) =>
            setListingsIn(checked ? "Done" : "Not Done")
          }
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Listings Date:</label>
        <DatePicker
          value={listingsInDate}
          onChange={(date) => setListingsInDate(date)}
          style={{ width: "100%" }}
          placeholder="Select listings date"
        />
      </div>
    </Modal>
  );
};

export default ListingsModal;
