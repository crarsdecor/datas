import React, { useEffect, useState } from "react";
import { Button, message, Upload } from "antd";
import {
  UploadOutlined,
  DownloadOutlined,
  UserAddOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import axios from "axios";
import UserModal from "./Admin/UserModal";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import vid from "./vid.mp4";
import Graph from "../pages/Admin/Graph";
import { useNavigate } from "react-router-dom";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const UserTab = () => {
  const Navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
      setUsers(data);
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

  useEffect(() => {
    fetchUsers();
    fetchManagers();
  }, []);

  const handleCsvUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      await axios.post(`${apiUrl}/api/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      message.success("CSV uploaded successfully");
      fetchUsers();
    } catch (error) {
      message.error("Failed to upload CSV");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSample = () => {
    const link = document.createElement("a");
    link.href = "/Sample.csv"; // Replace with the correct path to your local file
    link.download = "Sample.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleLogout = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <div className="relative min-h-screen flex flex-col w-screen">
      {/* Background Video */}
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-screen h-full object-cover"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      >
        <source src={vid} type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Subtle Foreground */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />

      <Header onLogout={handleLogout} />

      <motion.div
        className="flex-grow flex flex-col items-center justify-center space-y-6 px-4 relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <Graph users={users} />

        <h1 className="text-3xl font-semibold text-white mb-4">
          Manage Your Users
        </h1>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            size="large"
            onClick={() => setIsModalVisible(true)}
            className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md"
          >
            Add User
          </Button>
          <Button
            type="primary"
            icon={<UnorderedListOutlined />}
            size="large"
            onClick={() => Navigate("/list")}
            className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md"
          >
            List
          </Button>
          <Upload
            beforeUpload={(file) => {
              handleCsvUpload(file);
              return false;
            }}
            accept=".csv"
            showUploadList={false}
          >
            <Button
              type="default"
              icon={<UploadOutlined />}
              size="large"
              loading={loading}
              className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md"
            >
              Bulk Import CSV
            </Button>
          </Upload>
          <Button
            type="default"
            icon={<DownloadOutlined />}
            size="large"
            onClick={handleDownloadSample}
            className="flex items-center justify-center px-6 py-3 rounded-lg shadow-md"
          >
            Download Sample CSV
          </Button>
        </div>

        <UserModal
          visible={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          fetchUsers={fetchUsers}
          managers={managers}
        />
      </motion.div>

      <Footer />
    </div>
  );
};

export default UserTab;
