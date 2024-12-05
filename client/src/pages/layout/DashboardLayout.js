// import React, { useState } from 'react';
// import Sidenav from './Sidenav';
// import Header from './Header';
// import { Outlet } from 'react-router-dom';

// const DashboardLayout = () => {
//   const [isSidebarOpen, setIsSidebarOpen] = useState(true);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const role = JSON.parse(localStorage.getItem('user'))?.role || '';

//   return (
//     <div className="flex h-screen">
//       {/* Sidebar */}
//       {isSidebarOpen && (
//         <Sidenav role={role} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
//       )}

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col">
//         {/* Pass toggleSidebar to Header */}
//         <Header toggleSidebar={toggleSidebar} />
//         <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;



import React, { useState } from 'react';
import Sidenav from './Sidenav';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const role = JSON.parse(localStorage.getItem('user'))?.role || '';

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      {isSidebarOpen && (
        <Sidenav role={role} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Pass toggleSidebar to Header */}
        <Header toggleSidebar={toggleSidebar} />
        <main className="flex-1 p-4 bg-gray-50 overflow-y-auto">
          <Outlet /> {/* Render nested route content here */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
