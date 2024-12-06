import React, { useEffect } from 'react';
import axios from 'axios';

const IN = () => {
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Retrieve and parse the user object from local storage
        const user = JSON.parse(localStorage.getItem('user'));

        // Validate that user and id exist
        if (!user || !user.id) {
          console.error('User ID not found in local storage');
          return;
        }

        // Extract the user ID
        const userId = user.id;

        // Make an API call using the extracted ID
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/${userId}`);
        
        // Log the response data
        console.log('Response Data:', response.data);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <div>IN</div>
  );
};

export default IN;
