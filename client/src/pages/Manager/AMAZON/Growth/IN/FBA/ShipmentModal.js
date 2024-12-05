import React, { useState, useEffect } from "react";
import { Modal, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ShippingModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [shipmentIn, setShipmentIn] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setShipmentIn(user.shipmentIn ? moment(user.shipmentIn) : null); // Default to null if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        shipmentIn: shipmentIn ? shipmentIn.toISOString() : null,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        shipmentIn: shipmentIn ? shipmentIn.toISOString() : null,
      });

      message.success("Shipment date updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update shipment date. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Shipment Date"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>Shipment Date:</label>
        <DatePicker
          value={shipmentIn}
          onChange={(date) => setShipmentIn(date)}
          style={{ width: "100%" }}
          placeholder="Select shipment date"
        />
      </div>
    </Modal>
  );
};

export default ShippingModal;
