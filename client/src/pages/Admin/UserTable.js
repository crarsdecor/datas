import React, { useState } from "react";
import { Table, Button, Select, Popconfirm, Tag, Modal, Radio } from "antd";
import moment from "moment";

const { Option } = Select;

const UserTable = ({
  users,
  managers,
  handleDeleteUser,
  handleAssignManagers,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filterOption, setFilterOption] = useState("all");

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
        <Popconfirm
          title="Are you sure to delete this user?"
          onConfirm={() => handleDeleteUser(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

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
    </>
  );
};

export default UserTable;
