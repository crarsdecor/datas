import React, { useEffect, useState } from "react";
import { Table, Spin, message } from "antd";
import axios from "axios";
import Stage3PaymentModal from "./Stage3PaymentModal";
import ServerpurchaseModal from "./ServerpurchaseModal";
import DomainclaimModal from "./DomainclaimModal";
import DomainmailverificationModal from "./DomainmailverificationModal";
import WebsiteuploadedModal from "./WebsiteuploadedModal";
import IdandpassModal from "./IdandpassModal";
import ReadytohandoverModal from "./ReadytohandoverModal";
import Stage3CompletionModal from "./Stage3CompletionModal";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Stage1Website = () => {
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
        title: "Enrollment ID (Website)",
        dataIndex: "enrollmentIdWebsite",
        key: "enrollmentIdWebsite",
        fixed: "left",
        width: 200,
      },
    {
        title: "Stage 3 Payment",
        key: "stage3payment",
        render: (_, record) => (
          <a onClick={() => handleModalOpen(record, "stage3payment")}>
            {record.stage3?.status || "Not Set"}
          </a>
        ),
      },      
    {
      title: "Server Purchase",
      key: "serverPurchase",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "serverPurchase")}>
          {record.serverPurchase || "Not Set"}
        </a>
      ),
    },
    {
      title: "Domain Claim",
      key: "domainClaim",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "domainClaim")}>
          {record.domainClaim || "Not Set"}
        </a>
      ),
    },
    {
      title: "Domain Mail Verification",
      key: "domainMailVerification",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "domainMailVerification")}>
          {record.domainMailVerification || "Not Set"}
        </a>
      ),
    },
    {
      title: "Website Uploaded",
      key: "websiteUploaded",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "websiteUploaded")}>
          {record.websiteUploaded || "Not Set"}
        </a>
      ),
    },
    {
      title: "ID & PASS",
      key: "idAndPass",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "idAndPass")}>
          {record.idAndPass || "Not Set"}
        </a>
      ),
    },
    {
      title: "Ready To Handover",
      key: "readyToHandover",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "readyToHandover")}>
          {record.readyToHandover || "Not Set"}
        </a>
      ),
    },
    {
      title: "Stage 3 Completion",
      key: "stage3Completion",
      render: (_, record) => (
        <a onClick={() => handleModalOpen(record, "stage3Completion")}>
          {record.stage3Completion || "Not Set"}
        </a>
      ),
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
      {modalState.visible && modalState.type === "stage3payment" && selectedUser && (
       <Stage3PaymentModal
       user={selectedUser}
       visible={modalState.visible}
       onClose={handleModalClose}
       onUpdate={handleUpdateUser}
     />
      )}
      {modalState.visible && modalState.type === "serverPurchase" && selectedUser && (
        <ServerpurchaseModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "domainClaim" && selectedUser && (
        <DomainclaimModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "domainMailVerification" && selectedUser && (
        <DomainmailverificationModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "websiteUploaded" && selectedUser && (
        <WebsiteuploadedModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "idAndPass" && selectedUser && (
        <IdandpassModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "readyToHandover" && selectedUser && (
        <ReadytohandoverModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
      {modalState.visible && modalState.type === "stage3Completion" && selectedUser && (
        <Stage3CompletionModal
          user={selectedUser}
          visible={modalState.visible}
          onClose={handleModalClose}
          onUpdate={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default Stage1Website;
