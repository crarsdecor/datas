import React, { useEffect, useState } from "react";
import { Card, Spin, message, Statistic } from "antd";
import axios from "axios";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const AssignedUsersTable = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        // Retrieve manager data from local storage
        const manager = JSON.parse(localStorage.getItem("user"));

        if (!manager || !manager.id) {
          message.error("Manager data not found. Please log in again.");
          setLoading(false);
          return;
        }

        // API call to fetch users assigned to the manager
        const { data } = await axios.get(`${apiUrl}/api/users?managerId=${manager.id}`);
        setAssignedUsers(data);
      } catch (error) {
        message.error("Failed to fetch assigned users.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, []);

  if (loading) {
    return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
  }

  if (assignedUsers.length === 0) {
    return <h3 style={{ textAlign: "center", marginTop: "20%" }}>No users assigned to you yet.</h3>;
  }

  return (
    <div style={{ padding: "24px", display: "flex", gap: "24px", justifyContent: "center", flexWrap: "wrap" }}>
      <Card
        bordered={false}
        style={{ width: 300, textAlign: "center", backgroundColor: "#f0f2f5", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)" }}
      >
        <Statistic
          title="Total Assigned Users"
          value={assignedUsers.length}
          style={{ fontSize: "24px", fontWeight: "bold", color: "#1890ff" }}
        />
      </Card>

    </div>
  );
};

export default AssignedUsersTable;
