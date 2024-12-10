import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, defs, linearGradient, stop } from 'recharts';

const EnrollmentPieChart = ({ users }) => {
  // Calculate the count of users with non-empty enrollmentIdAmazon and enrollmentIdWebsite
  const amazonCount = users.filter((user) => user.enrollmentIdAmazon).length;
  const websiteCount = users.filter((user) => user.enrollmentIdWebsite).length;

  const data = [
    { name: 'Amazon Enrollment', value: amazonCount },
    { name: 'Website Enrollment', value: websiteCount },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        {/* Defining Vibrant Gradients for each sector */}
        <defs>
          {/* Gradient for Amazon Enrollment */}
          <linearGradient id="amazonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1D976C" />
            <stop offset="100%" stopColor="#93F9B9" />
          </linearGradient>
          
          {/* Gradient for Website Enrollment */}
          <linearGradient id="websiteGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF6F61" />
            <stop offset="100%" stopColor="#D84A42" />
          </linearGradient>
        </defs>
        
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
          <Cell fill="url(#amazonGradient)" />
          <Cell fill="url(#websiteGradient)" />
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EnrollmentPieChart;
