import React, { useState, useEffect } from "react";
import { Modal, Switch, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ListingsModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [listingsCom, setListingsCom] = useState("Not Done"); // Initialize as "Not Done"
  const [listingsComDate, setListingsComDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setListingsCom(user.listingsCom || "Not Done"); // Use "Done"/"Not Done" instead of boolean
      setListingsComDate(
        user.listingsComDate ? moment(user.listingsComDate) : null
      );
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        listingsCom,
        listingsComDate: listingsComDate ? listingsComDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        listingsCom: optimisticUser.listingsCom,
        listingsComDate: optimisticUser.listingsComDate,
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
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Status:</label>
        <Switch
          checked={listingsCom === "Done"}
          onChange={(checked) =>
            setListingsCom(checked ? "Done" : "Not Done")
          }
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Listings Date:</label>
        <DatePicker
          value={listingsComDate}
          onChange={(date) => setListingsComDate(date)}
          style={{ width: "100%" }}
          placeholder="Select listings date"
        />
      </div>
    </Modal>
  );
};

export default ListingsModal;
