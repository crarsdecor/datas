import React, { useEffect, useState } from "react";
import { message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import UserTable from "./UserTable";
import Footer from "../layout/Footer";
import Piechart from "./Piechart";
import Filters from "./Filters"; // Import the Filters component

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const List = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  console.log(filteredUsers.length);
  const [managers, setManagers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
      setUsers(data);
      setFilteredUsers(data); // Initialize filtered users
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

  const handleAssignManagers = async (userId, managerIds) => {
    try {
      await axios.put(`${apiUrl}/api/users/${userId}`, { managerIds });
      message.success("Managers assigned successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to assign managers");
    }
  };

  const handleSearch = (query) => {
    const filtered = users.filter((user) => {
      // Convert all fields to lowercase for comparison
      const queryLower = query.toLowerCase();

      return (
        user.uid?.toLowerCase().includes(queryLower) ||
        user.name?.toLowerCase().includes(queryLower) ||
        user.email?.toLowerCase().includes(queryLower) ||
        user.primaryContact?.toLowerCase().includes(queryLower) ||
        user.managers?.some((manager) =>
          manager.name?.toLowerCase().includes(queryLower)
        ) ||
        user.enrollmentIdAmazon?.toLowerCase().includes(queryLower) ||
        user.enrollmentIdWebsite?.toLowerCase().includes(queryLower) ||
        user.batchAmazon?.toLowerCase().includes(queryLower) ||
        user.batchWebsite?.toLowerCase().includes(queryLower)
      );
    });

    setFilteredUsers(filtered);
  };

  const handleEnrollmentFilter = (filter) => {
    const filtered = users.filter((user) => {
      if (filter === "amazon") {
        return user.enrollmentIdAmazon && !user.enrollmentIdWebsite;
      }
      if (filter === "website") {
        return user.enrollmentIdWebsite && !user.enrollmentIdAmazon;
      }
      if (filter === "both") {
        return user.enrollmentIdAmazon && user.enrollmentIdWebsite;
      }
      return true; // No filter applied
    });

    setFilteredUsers(filtered);
  };

  useEffect(() => {
    fetchUsers();
    fetchManagers();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col bg-gray-900 text-gray-100"
      style={{ paddingTop: "4rem" }}
    >
      <motion.div
        className="w-full px-6 py-6 flex-grow bg-gray-800 rounded-md shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Filters Component */}
        <Filters
          onSearch={handleSearch}
          onEnrollmentFilter={handleEnrollmentFilter}
        />

        {/* Display Pie Chart */}
        <div className="mb-8">
          <Piechart users={filteredUsers} />
        </div>
        <div className="flex justify-end items-center mt-8">
          <h2 className="text-2xl font-semibold text-white">
            Total Users:
            <span className="text-3xl ml-4 font-bold text-blue-500 animate-pulse glow">
              {filteredUsers.length}
            </span>
          </h2>
        </div>
        <UserTable
          users={filteredUsers}
          managers={managers}
          handleDeleteUser={handleDeleteUser}
          handleAssignManagers={handleAssignManagers}
        />
      </motion.div>
      <Footer />
    </div>
  );
};

export default List;
