import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import BrandModal from "./BrandModal";
import DateModal from "./DateModal";
import FbaAmountModal from "./FbaAmountModal";
import FbaLiveModal from "./FbaLiveModal";
import FbaRegistrationModal from "./FbaRegistrationModal";
import ShipmentModal from "./ShipmentModal";
import SkuModal from "./SkuModal";


const apiUrl = process.env.REACT_APP_BACKEND_URL;

const FBA = () => {
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
      title: "Date",
      key: "dateFbaCom",
      width: 100,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "dateFbaCom")}>
          {record.dateFbaCom || "Not Set"}
        </a>
      ),
    },
    {
        title: "Enrollment ID (Amazon)",
        dataIndex: "enrollmentIdAmazon",
        key: "enrollmentIdAmazon",
        fixed: "left",
        width: 200,
      },
      {
        title: "Brand Name",
        key: "brandName",
        width: 120,
        render: (_, record) => (
          <a onClick={() => handleModalOpen(record, "brandName")}>
            {record.brandName || "Not Set"}
          </a>
        ),
      },
    {
      title: "FBA Amount",
      key: "fbaAmountCom",
      width: 130,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "fbaAmountCom")}>
          {record.fbaAmountCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "SKU",
      key: "skuCom",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "skuCom")}>
          {record.skuCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "FBA Registration",
      key: "fbaRegistration",
      width: 120,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "fbaRegistration")}>
          {record.fbaRegistration || "Not Set"}
        </a>
      ),
    },
    {
      title: "Shipment Create",
      key: "shipmentCom",
      width: 100,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "shipmentCom")}>
          {record.shipmentCom || "Not Set"}
        </a>
      ),
    },
    {
      title: "FBA Live",
      key: "fbaLiveCom",
      width: 160,
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "fbaLiveCom")}>
          {record.fbaLiveCom || "Not Set"}
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
      {modalState.visible && modalState.type === "dateFbaCom" && selectedUser && (
        <DateModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "brandName" && selectedUser && (
        <BrandModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "fbaAmountCom" && selectedUser && (
        <FbaAmountModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "skuCom" && selectedUser && (
        <SkuModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "fbaRegistration" && selectedUser && (
        <FbaRegistrationModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "shipmentCom" && selectedUser && (
        <ShipmentModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "fbaLiveCom" && selectedUser && (
        <FbaLiveModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default FBA;
