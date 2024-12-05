import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import moment from "moment";
import AccountOpenModal from "./AccountOpenModal";
import KycStatusModal from "./KycStatusModal";
import UserIdPassModal from "./UserIdPassModal";
import ListingsModal from "./ListingsModal";
import AccountStatusModal from "./AccountStatusModal";


const apiUrl = process.env.REACT_APP_BACKEND_URL;

const In = () => {
  const [assignedUsers, setAssignedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalState, setModalState] = useState({ visible: false, type: null });

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      try {
        const manager = JSON.parse(localStorage.getItem("user"));

        if (!manager || !manager.id) {
          message.error("Manager data not found. Please log in again.");
          setLoading(false);
          return;
        }

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

  const handleModalOpen = (user, type) => {
    setSelectedUser(user);
    setModalState({ visible: true, type });
  };

  const handleModalClose = () => {
    setModalState({ visible: false, type: null });
  };

  const handleUpdateUser = (updatedUser) => {
    setAssignedUsers((users) =>
      users.map((user) => (user._id === updatedUser._id ? updatedUser : user))
    );
  };

  const columns = [
    {
      title: "Date (AMAZON)",
      dataIndex: "dateAmazon",
      key: "dateAmazon",
      render: (date) => (date ? moment(date).format("DD-MM-YYYY") : "N/A"),
      responsive: ["lg"],
    },
    {
        title: "Enrollment ID (Amazon)",
        dataIndex: "enrollmentIdAmazon",
        key: "enrollmentIdAmazon",
        fixed: "left",
        width: 200,
      },
    {
      title: "Batch",
      dataIndex: "batchAmazon",
      key: "batchAmazon",
      responsive: ["md"],
    },
    {
        title: "Account Open",
        key: "accountOpenCom",
        render: (_, record) => (
          <a onClick={() => handleModalOpen(record, "accountOpenCom")}>
            {record.accountOpenCom || "Not Set"}
          </a>
        ),
      },
      {
        title: "KYC Status",
        key: "kycStatus",
        render: (_, record) => (
          <a onClick={() => handleModalOpen(record, "kycStatus")}>
            {record.kycStatus || "Not Set"}
          </a>
        ),
      },
      {
        title: "User ID & PASS",
        key: "theme",
        render: (_, record) => (
          <a onClick={() => handleModalOpen(record, "userIDPASS")}>
            {record.theme || "Not Set"}
          </a>
        ),
      },
      {
        title: "Listings",
        key: "listingsCom",
        render: (_, record) => (
          <a onClick={() => handleModalOpen(record, "listingsCom")}>
            {record.listingsCom || "Not Set"}
          </a>
        ),
      },
    {
      title: "Account Status",
      key: "accountStatusCom",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "accountStatusCom")}>
          {record.accountStatusCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "Remark",
      key: "accountLaunchIn",
      width: 100,
    //   render: (_, record) => (
    //     <a onClick={() => handleModalOpen(record, "accountLaunchIn")}>
    //       {record.accountLaunchIn || "Not Set"}
    //     </a>
    //   ),
    },
  ];

  if (loading) {
    return <Spin size="large" style={{ display: "flex", justifyContent: "center", marginTop: "20%" }} />;
  }

  if (assignedUsers.length === 0) {
    return <h3 style={{ textAlign: "center", marginTop: "20%" }}>No users assigned to you yet.</h3>;
  }

  return (
    <div style={{ padding: "24px" }}>
      <Table
        dataSource={assignedUsers}
        columns={columns}
        rowKey="_id"
        bordered
        scroll={{ x: "max-content", y: 400 }}
        sticky
      />
      {modalState.visible && modalState.type === "accountOpenCom" && selectedUser && (
        <AccountOpenModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "kycStatus" && selectedUser && (
        <KycStatusModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "userIDPASS" && selectedUser && (
        <UserIdPassModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "listingsCom" && selectedUser && (
        <ListingsModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "accountStatusCom" && selectedUser && (
        <AccountStatusModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default In;
