import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardAdmin from './pages/Dashboard';
import Signin from './pages/signin/Signin';
import ProtectedRoute from './ProtectedRoute';
import NotFound from './NotFound';
import Unauthorized from './Unauthorized';
import List from './pages/Admin/List';


const App = () => (
  <Router>
    <Routes>
       {/* Redirect "/" to Signin */}
       <Route path="/" element={<Navigate to="/signin" replace />} />

      {/* Public route for sign-in */}
      <Route path="/signin" element={<Signin />} />

      {/* Admin dashboard (admin-only) */}
      <Route
        path="/dashboard-admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <DashboardAdmin />
          </ProtectedRoute>
        }
      />
      <Route
        path="/list"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <List />
          </ProtectedRoute>
        }
      />

      {/* Unauthorized page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Fallback route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Router>
);

export default App;
