import React, { useState } from "react";
import {
  Table,
  Button,
  Select,
  Popconfirm,
  Tag,
  Modal,
  Radio,
  Input,
} from "antd";
import moment from "moment";
import { CSVLink } from "react-csv";

const { Option } = Select;

const UserTable = ({
  users,
  managers,
  handleDeleteUser,
  handleAssignManagers,
  handleUpdateUser, // Function to handle update user data
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false); // Modal state for editing
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterOption, setFilterOption] = useState("all");
  const [editUserData, setEditUserData] = useState({});

  const showModal = (user) => {
    setSelectedUser(user);
    setIsModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setSelectedUser(null);
  };

  const handleFilterChange = (e) => {
    setFilterOption(e.target.value);
  };

  const handleEditClick = (user) => {
    setEditUserData({ ...user });
    setIsEditModalVisible(true);
  };

  const handleEditSubmit = () => {
    // Send updated user data to the backend using the handleUpdateUser function
    handleUpdateUser(editUserData);
    setIsEditModalVisible(false);
  };

  // Filter users based on selected filter option
  const filteredUsers = users.filter((user) => {
    switch (filterOption) {
      case "amazon":
        return user.enrollmentIdAmazon;
      case "website":
        return user.enrollmentIdWebsite;
      case "amazonOnly":
        return user.enrollmentIdAmazon && !user.enrollmentIdWebsite;
      case "websiteOnly":
        return !user.enrollmentIdAmazon && user.enrollmentIdWebsite;
      case "amazonWebsite":
        return user.enrollmentIdAmazon && user.enrollmentIdWebsite;
      default:
        return true; // Show all users
    }
  });

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      render: (uid, record) => (
        <Tag
          color="blue"
          style={{ cursor: "pointer" }}
          onClick={() => showModal(record)}
        >
          {uid}
        </Tag>
      ),
    },
    {
      title: "Date (AMAZON)",
      dataIndex: "dateAmazon",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
    },
    {
      title: "E. ID AMAZON",
      dataIndex: "enrollmentIdAmazon",
    },
    {
      title: "Date (WEBSITE)",
      dataIndex: "dateWebsite",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
    },
    { title: "E. ID WEBSITE", dataIndex: "enrollmentIdWebsite" },
    { title: "Batch (WEBSITE)", dataIndex: "batchWebsite" },
    { title: "Batch (AMAZON)", dataIndex: "batchAmazon" },
    { title: "Name", width: 180, dataIndex: "name" },
    { title: "Email", dataIndex: "email" },
    { title: "Primary Contact", dataIndex: "primaryContact" },
    { title: "Password", dataIndex: "password" },
    {
      title: "Assigned Managers",
      render: (_, record) =>
        record.managers && record.managers.length > 0 ? (
          record.managers.map((manager) => (
            <Tag color="blue" key={manager._id}>
              {manager.name}
            </Tag>
          ))
        ) : (
          <Tag color="red">No Managers Assigned</Tag>
        ),
    },
    {
      title: "Assign Managers",
      render: (_, record) => (
        <Select
          mode="multiple"
          placeholder="Select Managers"
          style={{ width: "100%" }}
          onChange={(value) => handleAssignManagers(record._id, value)}
          defaultValue={record.managers?.map((manager) => manager._id)}
        >
          {managers.map((manager) => (
            <Option key={manager._id} value={manager._id}>
              {manager.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            onClick={() => handleEditClick(record)} // Add Edit button
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDeleteUser(record._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  const csvData = filteredUsers.map((user) => ({
    UID: user.uid,
    Name: user.name,
    Email: user.email,
    "Primary Contact": user.primaryContact,
    "Enrollment ID Amazon": user.enrollmentIdAmazon || "N/A",
    "Enrollment ID Website": user.enrollmentIdWebsite || "N/A",
    "Batch Amazon": user.batchAmazon || "N/A",
    "Batch Website": user.batchWebsite || "N/A",
    "Date Amazon": user.dateAmazon
      ? moment(user.dateAmazon).format("DD-MM-YYYY")
      : "N/A",
    "Date Website": user.dateWebsite
      ? moment(user.dateWebsite).format("DD-MM-YYYY")
      : "N/A",
  }));

  return (
    <>
      <div className="flex mb-8 justify-between items-center">
        <Radio.Group
          onChange={handleFilterChange}
          value={filterOption}
          className="mr-4"
        >
          <Radio.Button value="all">All</Radio.Button>
          <Radio.Button value="amazon">Amazon</Radio.Button>
          <Radio.Button value="website">Website</Radio.Button>
          <Radio.Button value="amazonOnly">Amazon Only</Radio.Button>
          <Radio.Button value="websiteOnly">Website Only</Radio.Button>
          <Radio.Button value="amazonWebsite">Amazon & Website</Radio.Button>
        </Radio.Group>
        <CSVLink data={csvData} filename="filtered_users.csv">
          <Button type="primary">Download CSV</Button>
        </CSVLink>
        <div className="flex justify-center items-center">
          <h2 className="text-2xl font-semibold text-black">
            Total Users:
            <span className="text-3xl ml-4 font-bold text-blue-500 animate-pulse glow">
              {filteredUsers.length}
            </span>
          </h2>
        </div>
      </div>

      <Table
        className="bg-gray-800 text-gray-100"
        dataSource={filteredUsers}
        rowKey="_id"
        columns={columns}
        scroll={{ x: 1800 }} // Enable horizontal scrolling for responsiveness
        bordered
        pagination={{ pageSize: 100 }}
      />

      <Modal
        title="User Details"
        visible={isModalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        {selectedUser && (
          <table className="table-auto w-full text-gray-700">
            <tbody>
              <tr>
                <td className="font-bold">GST Number:</td>
                <td>{selectedUser.gstNumber}</td>
              </tr>
              <tr>
                <td className="font-bold">State:</td>
                <td>{selectedUser.state || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-bold">Address:</td>
                <td>{selectedUser.address || "N/A"}</td>
              </tr>
              <tr>
                <td className="font-bold">Pincode:</td>
                <td>{selectedUser.pincode}</td>
              </tr>
              <tr>
                <td className="font-bold">Country:</td>
                <td>{selectedUser.country}</td>
              </tr>
            </tbody>
          </table>
        )}
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="Edit User"
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onOk={handleEditSubmit}
        okText="Save"
        cancelText="Cancel"
        className="modal-custom" // Custom class for the modal
      >
        <div className="space-y-4">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <Input
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Name"
              value={editUserData.name}
              onChange={(e) =>
                setEditUserData({ ...editUserData, name: e.target.value })
              }
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <Input
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Email"
              value={editUserData.email}
              onChange={(e) =>
                setEditUserData({ ...editUserData, email: e.target.value })
              }
            />
          </div>

          {/* Primary Contact Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Primary Contact
            </label>
            <Input
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Primary Contact"
              value={editUserData.primaryContact}
              onChange={(e) =>
                setEditUserData({
                  ...editUserData,
                  primaryContact: e.target.value,
                })
              }
            />
          </div>

          {/* Batch (AMAZON) Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Batch (AMAZON)
            </label>
            <Input
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Batch (AMAZON)"
              value={editUserData.batchAmazon}
              onChange={(e) =>
                setEditUserData({
                  ...editUserData,
                  batchAmazon: e.target.value,
                })
              }
            />
          </div>

          {/* Batch (WEBSITE) Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Batch (WEBSITE)
            </label>
            <Input
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Batch (WEBSITE)"
              value={editUserData.batchWebsite}
              onChange={(e) =>
                setEditUserData({
                  ...editUserData,
                  batchWebsite: e.target.value,
                })
              }
            />
          </div>

          {/* Enrollment ID (AMAZON) Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enrollment ID (AMAZON)
            </label>
            <Input
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enrollment ID (AMAZON)"
              value={editUserData.enrollmentIdAmazon}
              onChange={(e) =>
                setEditUserData({
                  ...editUserData,
                  enrollmentIdAmazon: e.target.value,
                })
              }
            />
          </div>

          {/* Enrollment ID (WEBSITE) Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enrollment ID (WEBSITE)
            </label>
            <Input
              className="mt-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enrollment ID (WEBSITE)"
              value={editUserData.enrollmentIdWebsite}
              onChange={(e) =>
                setEditUserData({
                  ...editUserData,
                  enrollmentIdWebsite: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default UserTable;
