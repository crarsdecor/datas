import React, { useState, useEffect } from "react";
import { Modal, Switch, Input, DatePicker, message } from "antd";
import axios from "axios";
import moment from "moment";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const LegalityModal = ({ user, visible, onClose, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [legality, setLegality] = useState(false);
  const [legalityDate, setLegalityDate] = useState(null);
  const [legalityLink, setLegalityLink] = useState("");

  // Initialize values when the modal opens
  useEffect(() => {
    if (user) {
      setLegality(user.legality === "Done"); // Map "Done" to true and others to false
      setLegalityDate(user.legalityDate ? moment(user.legalityDate) : null);
      setLegalityLink(user.legalityLink || "");
    }
  }, [user]);

  const handleUpdate = async () => {
    try {
      setLoading(true);
  
      // Optimistically update the parent
      const optimisticUser = {
        ...user,
        legality: legality ? "Done" : "Not Done",
        legalityDate: legalityDate ? legalityDate.toISOString() : null,
        legalityLink,
      };
      onUpdate(optimisticUser);
  
      // Make the API call
      const { data } = await axios.put(`${apiUrl}/api/users/${user._id}`, {
        legality: optimisticUser.legality,
        legalityDate: optimisticUser.legalityDate,
        legalityLink: optimisticUser.legalityLink,
      });
  
      message.success("Legality details updated successfully.");
      onUpdate(data); // Update with server response
    } catch (error) {
      message.error("Failed to update legality details. Please try again.");
    } finally {
      setLoading(false);
      onClose();
    }
  };
  

  return (
    <Modal
      title="Update Legality Details"
      visible={visible}
      onCancel={onClose}
      onOk={handleUpdate}
      confirmLoading={loading}
    >
      <div style={{ marginBottom: 16 }}>
        <label>Legality Status:</label>
        <Switch
          checked={legality}
          onChange={(checked) => setLegality(checked)}
          checkedChildren="Done"
          unCheckedChildren="Not Done"
        />
      </div>
      <div style={{ marginBottom: 16 }}>
        <label>Legality Date:</label>
        <DatePicker
          value={legalityDate}
          onChange={(date) => setLegalityDate(date)}
          style={{ width: "100%" }}
          placeholder="Select legality date"
        />
      </div>
      <div>
        <label>Legality Link:</label>
        <Input
          value={legalityLink}
          onChange={(e) => setLegalityLink(e.target.value)}
          placeholder="Enter legality link"
        />
      </div>
    </Modal>
  );
};

export default LegalityModal;
