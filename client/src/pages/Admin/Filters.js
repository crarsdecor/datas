import React, { useState } from "react";
import { Input, Select, Button } from "antd";

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

      {/* Enrollment ID Filter */}
      <Select
        placeholder="Filter by services"
        onChange={handleEnrollmentFilterChange}
        // value={enrollmentFilter}
        value={enrollmentFilter || "all"}
        allowClear
        className="mb-4 md:mb-0 md:mr-4"
        style={{ width: "200px" }}
      >
        <Option value="all">All</Option>
        <Option value="amazon">Amazon Only</Option>
        <Option value="website">Website Only</Option>
        <Option value="both">Amazon & Website</Option>
      </Select>
    </div>
  );
};

export default Filters;
