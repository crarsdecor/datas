import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component";
import "react-vertical-timeline-component/style.min.css";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaUser,
  FaExclamationCircle,
  FaRegCalendarAlt,
} from "react-icons/fa";

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const IN = () => {
  const [userData, setUserData] = useState(null); // null to handle loading state
  console.log(userData);
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
          date="Legality Details"
          iconStyle={{
            background: userData.legality === "Done" ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.legality === "Done" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            Legality Status
          </h3>
          <h4 className="mt-4">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              {userData.legality === "Done" ? (
                <>
                  <FaCheckCircle
                    style={{
                      color: "green",
                      fontSize: "20px",
                      marginRight: "8px",
                    }}
                  />
                  <span style={{ color: "green", fontWeight: "bold" }}>
                    Completed
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
          <p className="text-gray-700 mt-2">
            <button
              onClick={() => {
                if (userData.legalityLink) {
                  window.open(
                    userData.legalityLink,
                    "_blank",
                    "noopener,noreferrer"
                  );
                } else {
                  alert("No Link Available");
                }
              }}
              className={`px-4 py-2 mt-2 rounded ${
                userData.legalityLink
                  ? "bg-blue-500 text-white hover:bg-blue-500"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
              disabled={!userData.legalityLink}
            >
              {userData.legalityLink
                ? "Go to Legality Details"
                : "No Link Available"}
            </button>
          </p>
        </VerticalTimelineElement>

        {/* GST Information */}

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="GST Details"
          iconStyle={{
            background: userData.gstNumber ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.gstNumber ? <FaCheckCircle /> : <FaExclamationCircle />
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            GST Information
          </h3>
          <p className="text-gray-700 mt-2">
            <strong>GST No.: </strong> {userData.gstNumber || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>GST Date: </strong> {formatDate(userData.gstDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="Account Info."
          iconStyle={{
            background: userData.accountOpenIn === "Opened" ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.accountOpenIn === "Opened" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            Account Information
          </h3>
          <p className="text-gray-700 mt-2">
            <strong>Account: </strong> {userData.accountOpenIn || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>GST Date: </strong>{" "}
            {formatDate(userData.accountOpenInDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="Account Status"
          iconStyle={{
            background:
              userData.accountStatusIn === "Approved" ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.accountStatusIn === "Approved" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            Account Status
          </h3>
          <p className="text-gray-700 mt-2">
            <strong>Account Status: </strong>{" "}
            {userData.accountStatusIn || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Date: </strong>{" "}
            {formatDate(userData.accountStatusInDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="Brand Details"
          iconStyle={{
            background: userData.brandName ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.brandName ? <FaCheckCircle /> : <FaExclamationCircle />
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            Brand Details
          </h3>
          <p className="text-gray-700 mt-2">
            <strong>Brand Name: </strong> {userData.brandName || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Date: </strong>{" "}
            {formatDate(userData.brandNameDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="Listing Info"
          iconStyle={{
            background: userData.listingsIn === "Done" ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.listingsIn === "Done" ? (
              <FaCheckCircle />
            ) : (
              <FaExclamationCircle />
            )
          }
        >
          <h3 className="vertical-timeline-element-title text-lg font-semibold">
            Listing Info.
          </h3>
          <p className="text-gray-700 mt-2">
            <strong>Listing: </strong> {userData.listingsIn || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Listing Date: </strong>{" "}
            {formatDate(userData.listingsInDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        <VerticalTimelineElement
          className="vertical-timeline-element--gst"
          date="Account Info"
          iconStyle={{
            background:
              userData.accountLaunchIn === "Launched" ? "green" : "red", // Dynamic background color
            color: "#fff",
          }}
          icon={
            userData.accountLaunchIn === "Launched" ? (
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
            <strong>Account: </strong> {userData.accountLaunchIn || "N/A"}
          </p>
          <p className="text-gray-700">
            <strong>Launch Date: </strong>{" "}
            {formatDate(userData.accountLaunchInDate) || "N/A"}
          </p>
        </VerticalTimelineElement>

        {/* Add more timeline elements as needed */}
      </VerticalTimeline>
    </div>
  );
};

export default IN;
