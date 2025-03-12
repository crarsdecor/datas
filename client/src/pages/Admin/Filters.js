import React, { useState } from "react";
import { Input, Select, Button, message } from "antd";

const { Search } = Input;
const { Option } = Select;

const Filters = ({ onSearch, onFilter, onEnrollmentFilter }) => {
  const [roleFilter, setRoleFilter] = useState("");
  const [enrollmentFilter, setEnrollmentFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value) => {
    setSearchQuery(value);
    onSearch(value.trim().toLowerCase());
  };

  const handleRoleFilterChange = (value) => {
    setRoleFilter(value);
    onFilter(value);
  };

  const handleEnrollmentFilterChange = (value) => {
    setEnrollmentFilter(value);

    if (value === "all") {
      // Reset the enrollment filter if "All" is selected
      onEnrollmentFilter(""); // Reset filter here
    } else {
      onEnrollmentFilter(value);
    }
  };

  const handleLogoutClick = () => {
    localStorage.clear();
    message.success("Logged out successfully");
    window.location.href = "/"; // Redirect to login page
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-6">
      {/* Search Bar */}
      <Search
        placeholder="Search by UID, name, email, contact, etc..."
        onSearch={handleSearch}
        allowClear
        className="mb-4 md:mb-0 md:mr-4"
        style={{ width: "100%", maxWidth: "300px" }}
      />

      <Button
        onClick={handleLogoutClick}
        className="bg-red-500 text-white font-semibold"
      >
        Logout
      </Button>
    </div>
  );
};

export default Filters;
