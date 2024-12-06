import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import { FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const COM = () => {
  const [userData, setUserData] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));
  const formatDate = (date) => {
    if (!date) return "N/A";
    const formattedDate = new Date(date).toLocaleDateString("en-GB");
    return formattedDate;
  };

  async function fetchUserData() {
    try {
      const response = await axios.get(`${apiUrl}/api/users/${user.id}`);
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error.message);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
        User Information Timeline
      </h1>
      <VerticalTimeline>
        {/* Legality Information */}
        <VerticalTimelineElement
          className="vertical-timeline-element--user"
          date="Account Details"
          iconStyle={{
            background: userData.accountOpenCom === "Opened" ? "green" : "red",
            color: "#fff",
          }}
          icon={
            userData.accountOpenCom === "Opened" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            Account Status
          </h3>
          <h4 className="mt-4">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {userData.accountOpenCom === "Opened" ? (
                <>
                  <FaCheckCircle
                    style={{
                      color: "green",
                      fontSize: "20px",
                      marginRight: "8px",
                    }}
                  />
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    {userData.accountOpenCom}
                  </span>
                </>
              ) : (
                <>
                  <FaExclamationCircle
                    style={{
                      color: "red",
                      fontSize: "20px",
                      marginRight: "8px",
                    }}
                  />
                  <span style={{ color: "red", fontWeight: "bold" }}>
                    Not Completed
                  </span>
                </>
              )}
            </span>
          </h4>
          <p className="text-gray-700">
            <strong>Date: </strong>{" "}
            {formatDate(userData.accountOpenComDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="KYC Info"
          iconStyle={{
            background: userData.kycStatus === "Done" ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.kycStatus === "Done" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            KYC Info
          </h3>
          <p className="text-gray-700 mt-2">
            <strong>KYC Status: </strong> {userData.kycStatus || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Date: </strong> {formatDate(userData.kycStatusDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="Listing Details"
          iconStyle={{
            background: userData.listingsCom === "Done" ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.listingsCom === "Done" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            Listings Details
          </h3>
          <p className="text-gray-700 mt-2">
            <strong>Listings: </strong> {userData.listingsCom || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Date: </strong> {formatDate(userData.listingsComDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="Account Info"
          iconStyle={{
            background:
              userData.accountStatusCom !== "Deactivated" ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.accountStatusCom !== "Deactivated" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            Account Info
          </h3>
          <p className="text-gray-700 mt-2">
            <strong>Status: </strong> {userData.accountStatusCom || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Date: </strong> {formatDate(userData.accountStatusComDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        {/* Add more timeline elements if required */}
      </VerticalTimeline>
    </div>
  );
};

export default COM;
