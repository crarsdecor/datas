import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminPanel = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/active-logins', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSessions(response.data.activeSessions);
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  const handleRemoveSession = async (sessionId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete('/api/auth/remove-login', {
        headers: { Authorization: `Bearer ${token}` },
        data: { sessionId },
      });
      alert('Session removed successfully');
      fetchSessions(); // Refresh session list
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div>
      <h2>Active Admin Sessions</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>IP Address</th>
            <th>Device</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((session) => (
            <tr key={session._id}>
              <td>{session.adminId.email}</td>
              <td>{session.ipAddress || 'Unknown'}</td>
              <td>{session.deviceDetails || 'Unknown'}</td>
              <td>
                <button onClick={() => handleRemoveSession(session._id)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
