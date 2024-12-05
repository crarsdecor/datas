import React, { useState, useEffect } from "react";
import { Modal, Button, Input, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const GSTModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [gst, setGst] = useState(null); // "Done" or "Not Done"
  const [gstNumber, setGstNumber] = useState("");
  const [gstDate, setGstDate] = useState(null);

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setGst(user.gst || null); // Initial GST status
      setGstNumber(user.gstNumber || ""); // Initial GST number
      setGstDate(user.gstDate ? moment(user.gstDate) : null); // Initial GST date
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        gst,
        gstNumber,
        gstDate: gstDate ? gstDate.toISOString() : null,
      };
      onUpdate(optimisticUser);

      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        gst,
        gstNumber,
        gstDate: gstDate ? gstDate.toISOString() : null,
      });

      message.success("GST details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update GST details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };

  return (
    <Modal
      title="Update GST Details"
      open={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>GST Status:</label>
        <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
          <Button
            type={gst === "Done" ? "primary" : "default"}
            onClick={() => setGst("Done")}
          >
            Done
          </Button>
          <Button
            type={gst === "Not Done" ? "primary" : "default"}
            onClick={() => setGst("Not Done")}
          >
            Not Done
          </Button>
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>GST Number:</label>
        <Input
          value={gstNumber}
          onChange={(e) => setGstNumber(e.target.value)}
          placeholder="Enter GST number"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>GST Date:</label>
        <DatePicker
          value={gstDate}
          onChange={(date) => setGstDate(date)}
          style={{ width: "100%" }}
          placeholder="Select GST date"
        />
      </div>
    </Modal>
  );
};

export default GSTModal;
