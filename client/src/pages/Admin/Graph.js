// import React from 'react';
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   Legend,
// } from 'recharts';

// const Graph = ({ users }) => {
//   // Count users where specific enrollment IDs have non-empty values
//   const enrollmentData = [
//     {
//       name: 'Amazon',
//       count: users.filter((user) => user.enrollmentIdAmazon && user.enrollmentIdAmazon.trim() !== '').length,
//     },
//     {
//       name: 'Website',
//       count: users.filter((user) => user.enrollmentIdWebsite && user.enrollmentIdWebsite.trim() !== '').length,
//     },
//   ];

//   return (
//     <div className="w-full max-w-2xl h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-6">
//       <h2 className="text-2xl font-semibold text-gray-100 mb-6 text-center">
//         Enrollment ID Distribution
//       </h2>
//       <ResponsiveContainer>
//         <BarChart
//           data={enrollmentData}
//           margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
//         >
//           <CartesianGrid strokeDasharray="3 3" stroke="#444" />
//           <XAxis dataKey="name" stroke="#ddd" />
//           <YAxis stroke="#ddd" />
//           <Tooltip
//             contentStyle={{
//               backgroundColor: '#222',
//               border: '1px solid #444',
//               borderRadius: '8px',
//               color: '#fff',
//             }}
//             cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
//           />
//           <Legend
//             wrapperStyle={{
//               color: '#ddd',
//               paddingTop: '10px',
//             }}
//           />
//           <Bar
//             dataKey="count"
//             fill="url(#barGradient)"
//             radius={[10, 10, 0, 0]}
//             animationDuration={1000}
//           />
//           <defs>
//             <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
//               <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.8} />
//               <stop offset="100%" stopColor="#087F23" stopOpacity={0.8} />
//             </linearGradient>
//           </defs>
//         </BarChart>
//       </ResponsiveContainer>
//     </div>
//   );
// };

// export default Graph;




import React, { useState } from 'react';
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
  const [filter, setFilter] = useState('all');

  // Utility function to filter users based on date ranges
  const filterUsersByDate = (users, key, range) => {
    const now = new Date();
    let startDate;

    switch (range) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'last7days':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'thisMonth':
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        break;
      case 'last30days':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      case 'lastMonth':
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
        return users.filter(
          (user) =>
            user[key] &&
            new Date(user[key]) >= startDate &&
            new Date(user[key]) <= endDate
        );
      case 'last6months':
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1);
        break;
      case 'thisYear':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default:
        return users;
    }

    return users.filter((user) => user[key] && new Date(user[key]) >= startDate);
  };

  // Filtered data based on selected range
  const filteredUsers = users.filter(
    (user) =>
      filterUsersByDate([user], 'dateAmazon', filter).length > 0 ||
      filterUsersByDate([user], 'dateWebsite', filter).length > 0
  );

  const enrollmentData = [
    {
      name: 'Amazon',
      count: filterUsersByDate(filteredUsers, 'dateAmazon', filter).length,
    },
    {
      name: 'Website',
      count: filterUsersByDate(filteredUsers, 'dateWebsite', filter).length,
    },
  ];

  return (
    <div className="w-full max-w-2xl h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-lg p-6">
      <div className="mb-4 text-center">
        <select
          className="p-2 bg-gray-700 text-gray-100 rounded"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Time</option>
          <option value="today">Today</option>
          <option value="last7days">Last 7 Days</option>
          <option value="thisMonth">This Month</option>
          <option value="last30days">Last 30 Days</option>
          <option value="lastMonth">Last Month</option>
          <option value="last6months">Last 6 Months</option>
          <option value="thisYear">This Year</option>
        </select>
      </div>
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
