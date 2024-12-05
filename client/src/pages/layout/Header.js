// import React from 'react';

const Header = ({ toggleSidebar }) => {
    return (
      <header className="flex items-center justify-between bg-blue-600 text-white px-6 py-4 shadow-md">
        {/* Sidebar Toggle Button */}
        <button
          onClick={toggleSidebar}
          className="px-4 py-2 bg-gray-700 text-white font-semibold rounded-lg shadow hover:bg-gray-800 focus:outline-none focus:ring focus:ring-gray-400 transition duration-300 ease-in-out"
        >
          {`Toggle Menu`}
        </button>
  
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <h1 className="text-xl font-bold">CRM Dashboard</h1>
        </div>
  
        {/* Logout Button */}
        <button
          onClick={() => {
            localStorage.clear();
            window.location.href = '/signin'; // Redirect to login page
          }}
          className="px-4 py-2 bg-red-500 text-white font-semibold rounded-lg shadow hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300 transition duration-300 ease-in-out"
        >
          Log Out
        </button>
      </header>
    );
  };
  
  export default Header;
  