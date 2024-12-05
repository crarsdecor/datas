import React, { useState, useEffect } from "react";
import { Modal, Select, message } from "antd";
import axios from "axios";

const { Option } = Select;

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const ShippingModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [shipmentCom, setShipmentCom] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setShipmentCom(user.shipmentCom || ""); // Default to empty if not set
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistic update
      const optimisticUser = {
        ...user,
        shipmentCom,
      };
      onUpdate(optimisticUser); // Update parent state optimistically

      // API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        shipmentCom,
      });

      message.success("Shipment Completion updated successfully.");
      onUpdate(data); // Reconcile with server response
    } catch (error) {
      message.error("Failed to update Shipment Completion. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update Shipment Completion"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div>
        <label>Shipment Completion Status:</label>
        <Select
          value={shipmentCom}
          onChange={(value) => setShipmentCom(value)}
          style={{ width: "100%" }}
          placeholder="Select Shipment Completion status"
        >
          <Option value="Yes">Yes</Option>
          <Option value="No">No</Option>
        </Select>
      </div>
    </Modal>
  );
};

export default ShippingModal;
