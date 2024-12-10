// import React, { useEffect, useState } from 'react';
// import { Button, message } from 'antd';
// import { motion } from 'framer-motion';
// import axios from 'axios';
// import UserTable from './UserTable';
// import Header from '../layout/Header';
// import Footer from '../layout/Footer';

// const apiUrl = process.env.REACT_APP_BACKEND_URL;

// const List = () => {
//   const [users, setUsers] = useState([]);
//   const [managers, setManagers] = useState([]);

//   const fetchUsers = async () => {
//     try {
//       const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
//       setUsers(data);
//     } catch (error) {
//       message.error('Failed to fetch users');
//     }
//   };

//   const fetchManagers = async () => {
//     try {
//       const { data } = await axios.get(`${apiUrl}/api/users?role=manager`);
//       setManagers(data);
//     } catch (error) {
//       message.error('Failed to fetch managers');
//     }
//   };

//   const handleDeleteUser = async (id) => {
//     try {
//       await axios.delete(`${apiUrl}/api/users/${id}`);
//       message.success('User deleted successfully');
//       fetchUsers();
//     } catch (error) {
//       message.error('Failed to delete user');
//     }
//   };

//   const handleAssignManagers = async (userId, managerIds) => {
//     try {
//       await axios.put(`${apiUrl}/api/users/${userId}`, { managerIds });
//       message.success('Managers assigned successfully');
//       fetchUsers();
//     } catch (error) {
//       message.error('Failed to assign managers');
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//     fetchManagers();
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100" style={{ paddingTop: '4rem' }}>
//       <Header />
//       <motion.div
//         className="w-full px-6 py-6 flex-grow bg-gray-800 rounded-md shadow-lg"
//         initial={{ opacity: 0 }}
//         animate={{ opacity: 1 }}
//         transition={{ duration: 1 }}
//       >
//         <UserTable
//           users={users}
//           managers={managers}
//           handleDeleteUser={handleDeleteUser}
//           handleAssignManagers={handleAssignManagers}
//         />
//       </motion.div>
//       <Footer />
//     </div>
//   );
// };

// export default List;



import React, { useEffect, useState } from 'react';
import { Button, message } from 'antd';
import { motion } from 'framer-motion';
import axios from 'axios';
import UserTable from './UserTable';
import Header from '../layout/Header';
import Footer from '../layout/Footer';
import Piechart from './Piechart'; // Import the PieChart Component

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const List = () => {
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=user`);
      setUsers(data);
    } catch (error) {
      message.error('Failed to fetch users');
    }
  };

  const fetchManagers = async () => {
    try {
      const { data } = await axios.get(`${apiUrl}/api/users?role=manager`);
      setManagers(data);
    } catch (error) {
      message.error('Failed to fetch managers');
    }
  };

  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${apiUrl}/api/users/${id}`);
      message.success('User deleted successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to delete user');
    }
  };

  const handleAssignManagers = async (userId, managerIds) => {
    try {
      await axios.put(`${apiUrl}/api/users/${userId}`, { managerIds });
      message.success('Managers assigned successfully');
      fetchUsers();
    } catch (error) {
      message.error('Failed to assign managers');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchManagers();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100" style={{ paddingTop: '4rem' }}>
      <Header />
      <motion.div
        className="w-full px-6 py-6 flex-grow bg-gray-800 rounded-md shadow-lg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Display Pie Chart */}
        <div className="mb-8">
          <Piechart users={users} />
        </div>

        <UserTable
          users={users}
          managers={managers}
          handleDeleteUser={handleDeleteUser}
          handleAssignManagers={handleAssignManagers}
        />
      </motion.div>
      <Footer />
    </div>
  );
};

export default List;
