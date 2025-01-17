import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "antd"; // Ant Design for layout and styling

const EnrollmentPieChart = ({ users }) => {
  // Calculate the count of users with non-empty enrollmentIdAmazon and enrollmentIdWebsite
  const amazonCount = users.filter((user) => user.enrollmentIdAmazon).length;
  const websiteCount = users.filter((user) => user.enrollmentIdWebsite).length;

  const data = [
    { name: "Amazon Enrollment", value: amazonCount },
    { name: "Website Enrollment", value: websiteCount },
  ];

  const COLORS = ["#FF4D4F", "#1890FF"]; // Red for Amazon, Blue for Website

  return (
    <Card
      bordered={false}
      className="bg-white shadow-lg rounded-lg p-4 w-full mx-auto"
    >
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120} // Full circle with no inner radius
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(1)}%`
              }
              labelStyle={{
                fontSize: "12px",
                fontWeight: "500",
                fill: "#4B5563",
              }}
              animationBegin={0}
              animationDuration={1500}
              animationEasing="ease-out"
              isAnimationActive
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>

            {/* Tooltip */}
            <Tooltip
              contentStyle={{
                backgroundColor: "#F0F2F5",
                border: "1px solid #D9D9D9",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              }}
              labelStyle={{
                fontWeight: "bold",
                color: "#374151",
              }}
            />

            {/* Legend */}
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{
                marginTop: "10px",
                fontSize: "12px",
                color: "#4B5563",
                fontFamily: "Inter, sans-serif",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default EnrollmentPieChart;
