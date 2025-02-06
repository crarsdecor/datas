import React, { useEffect, useState } from "react";
import { message } from "antd";
import { motion } from "framer-motion";
import axios from "axios";
import UserTable from "./UserTable";
import Footer from "../layout/Footer";
import Piechart from "./Piechart";
import Filters from "./Filters";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const List = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [filterRange, setFilterRange] = useState("all");

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
        window.location.reload();
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
    const filtered = users.filter((user) => {
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
        return users.filter(
          (user) =>
            user.createdAt &&
            new Date(user.createdAt) >= previousMonth &&
            new Date(user.createdAt) <= endDate
        );
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
    return users.filter(
      (user) => user.createdAt && new Date(user.createdAt) >= startDate
    );
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
        <Filters
          onSearch={handleSearch}
          onEnrollmentFilter={handleEnrollmentFilter}
        />
        <div className="mb-8">
          <Piechart users={filteredUsers} />
        </div>
        <div className="text-center">
          <select
            className="p-2 bg-gray-700 text-gray-100 rounded"
            value={filterRange}
            onChange={(e) => setFilterRange(e.target.value)}
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="last7days">Last 7 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="last30days">Last 30 Days</option>
            <option value="lastMonth">Previous Month</option>
            <option value="last6months">Last 6 Months</option>
            <option value="thisYear">This Year</option>
          </select>
        </div>
        <UserTable
          users={filteredUsers}
          managers={managers}
          handleDeleteUser={handleDeleteUser}
          handleAssignManagers={handleAssignManagers}
          handleUpdateUser={handleUpdateUser}
        />
      </motion.div>
      <Footer />
    </div>
  );
};

export default List;
