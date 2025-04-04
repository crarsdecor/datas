import React, { useEffect, useState } from "react";
import { message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import Filters from "./Admin/Filters";
import Footer from "./layout/Footer";
import PieChart from "./Admin/Piechart";
import UserTable from "./Admin/UserTable";
import UserModal from "./Admin/UserModal"; // Import UserModal

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Supervisor = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [filterRange, setFilterRange] = useState("all");
  const [isModalVisible, setIsModalVisible] = useState(false); // State for user modal

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
      setUsers(data);
      setFilteredUsers(data);
    } catch (error) {
      message.error("Failed to fetch users");
    }
  };

  const fetchManagers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=manager`);
      setManagers(data);
    } catch (error) {
      message.error("Failed to fetch managers");
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/users/${id}`);
      message.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to delete user");
    }
  };

  const handleUpdateUser = async (editUserData) => {
    try {
      const response = await axios.put(
        `${apiUrl}/api/users/${editUserData.uid}`,
        {
          name: editUserData.name,
          email: editUserData.email,
          primaryContact: editUserData.primaryContact,
          batchAmazon: editUserData.batchAmazon,
          batchWebsite: editUserData.batchWebsite,
          enrollmentIdAmazon: editUserData.enrollmentIdAmazon,
          enrollmentIdWebsite: editUserData.enrollmentIdWebsite,
        }
      );

      if (response.status === 200) {
        message.success("User updated successfully!");
        fetchUsers(); // Refresh the user list
      } else {
        message.error("Failed to update user. Please try again.");
      }
    } catch (error) {
      message.error("Failed to update user. Please try again.");
    }
  };

  const handleAssignManagers = async (userId, managerIds) => {
    try {
      await axios.put(`${apiUrl}/api/users/asmanager/${userId}`, {
        managerIds,
      });
      message.success("Managers assigned successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to assign managers");
    }
  };

  const handleSearch = (query) => {
    const queryLower = query.toLowerCase();
    const filtered = users.filter((user) =>
      [
        user.uid,
        user.name,
        user.email,
        user.primaryContact,
        user.enrollmentIdAmazon,
        user.enrollmentIdWebsite,
        user.batchAmazon,
        user.batchWebsite,
        ...(user.managers?.map((manager) => manager.name) || []),
      ]
        .filter(Boolean)
        .some((field) => field.toLowerCase().includes(queryLower))
    );
    setFilteredUsers(filtered);
  };

  const handleEnrollmentFilter = (filter) => {
    const filtered = users.filter((user) => {
      if (filter === "amazon")
        return user.enrollmentIdAmazon && !user.enrollmentIdWebsite;
      if (filter === "website")
        return user.enrollmentIdWebsite && !user.enrollmentIdAmazon;
      if (filter === "both")
        return user.enrollmentIdAmazon && user.enrollmentIdWebsite;
      return true;
    });
    setFilteredUsers(filtered);
  };

  const filterUsersByDate = (users, range) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case "today":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case "last7days":
        startDate = new Date(new Date().setDate(now.getDate() - 7));
        break;
      case "thisMonth":
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case "last30days":
        startDate = new Date(new Date().setDate(now.getDate() - 30));
        break;
      case "lastMonth": {
        const previousMonth = new Date(
          now.getFullYear(),
          now.getMonth() - 1,
          1
        );
        const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        return users.filter((user) => {
          const enrollmentDate = user.dateAmazon
            ? new Date(user.dateAmazon)
            : user.dateWebsite
            ? new Date(user.dateWebsite)
            : null;
          return (
            enrollmentDate &&
            enrollmentDate >= previousMonth &&
            enrollmentDate <= endDate
          );
        });
      }
      case "last6months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case "thisYear":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return users;
    }

    return users.filter((user) => {
      const enrollmentDate = user.dateAmazon
        ? new Date(user.dateAmazon)
        : user.dateWebsite
        ? new Date(user.dateWebsite)
        : null;
      return enrollmentDate && enrollmentDate >= startDate;
    });
  };

  useEffect(() => {
    fetchUsers();
    fetchManagers();
  }, []);

  useEffect(() => {
    setFilteredUsers(filterUsersByDate(users, filterRange));
  }, [filterRange, users]);

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-900 text-gray-100"
      style={{ paddingTop: "4rem" }}
    >
      <motion.div
        className="w-full px-2 py-2 flex-grow bg-white rounded-md shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Add User Button */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600 transition"
            onClick={() => setIsModalVisible(true)}
          >
            + Add New User
          </button>
        </div>

        <Filters
          onSearch={handleSearch}
          onEnrollmentFilter={handleEnrollmentFilter}
        />

        <UserTable
          users={filteredUsers}
          managers={managers}
          handleDeleteUser={handleDeleteUser}
          handleAssignManagers={handleAssignManagers}
          handleUpdateUser={handleUpdateUser}
        />
      </motion.div>

      <Footer />

      {/* User Modal for Creating Users */}
      <UserModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        fetchUsers={fetchUsers}
        managers={managers}
      />
    </div>
  );
};

export default Supervisor;
