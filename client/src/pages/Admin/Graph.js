import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const Graph = ({ users }) => {
  // Count users where specific enrollment IDs have non-empty values
  const enrollmentData = [
    {
      name: 'Amazon',
      count: users.filter((user) => user.enrollmentIdAmazon && user.enrollmentIdAmazon.trim() !== '').length,
    },
    {
      name: 'Website',
      count: users.filter((user) => user.enrollmentIdWebsite && user.enrollmentIdWebsite.trim() !== '').length,
    },
  ];

  return (
    <div className="w-full max-w-2xl h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
        Enrollment ID Distribution
      </h2>
      <ResponsiveContainer>
        <BarChart
          data={enrollmentData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#ddd" />
          <YAxis stroke="#ddd" />
          <Tooltip
            contentStyle={{
              backgroundColor: '#222',
              border: '1px solid #444',
              borderRadius: '8px',
              color: '#fff',
            }}
            cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
          />
          <Legend
            wrapperStyle={{
              color: '#ddd',
              paddingTop: '10px',
            }}
          />
          <Bar
            dataKey="count"
            fill="url(#barGradient)"
            radius={[10, 10, 0, 0]}
            animationDuration={1000}
          />
          <defs>
            <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#087F23" stopOpacity={0.8} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Graph;
