// import React from 'react';
// import { Link } from 'react-router-dom';

// const menuItems = {
//   admin: [
//     { label: 'Dashboard', path: '/dashboard-admin' },
//     { label: 'Users', path: '/manage-users' },
//     { label: 'Reports', path: '/reports' },
//   ],
//   manager: [
//     { label: 'Dashboard', path: '/dashboard-manager' },
//     { label: 'Team', path: '/manage-team' },
//     { label: 'Tasks', path: '/tasks' },
//   ],
// };

// const Sidenav = ({ role }) => {
//   const items = menuItems[role] || [];
//   return (
//     <div style={{ width: '200px', background: '#333', color: '#fff', padding: '1rem' }}>
//       <ul>
//         {items.map((item, idx) => (
//           <li key={idx} style={{ margin: '1rem 0' }}>
//             <Link to={item.path} style={{ color: '#fff', textDecoration: 'none' }}>
//               {item.label}
//             </Link>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default Sidenav;




import React from 'react';
import { Link } from 'react-router-dom';

const menuItems = {
  admin: [
    { label: 'Dashboard', path: '/dashboard-admin' },
    { label: 'Contacts', path: '/contact' },
    { label: 'Reports', path: '/reports' },
  ],
  manager: [
    { label: 'Dashboard', path: '/dashboard-manager' },
    { label: 'Team', path: '/manage-team' },
    { label: 'Tasks', path: '/tasks' },
  ],
};

const Sidenav = ({ role, isOpen, toggleSidebar }) => {
  const items = menuItems[role] || [];

  return (
    <>
      {/* Sidebar / Drawer */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:w-64 transition-transform duration-300 ease-in-out z-40`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold">CRM Menu</h2>
          {/* Hide Sidebar Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
          >
            ×
          </button>
        </div>
        <ul className="p-4 space-y-4">
          {items.map((item, idx) => (
            <li key={idx}>
              <Link
                to={item.path}
                className="block px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white transition duration-200"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Sidenav;
