// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import {jwtDecode} from 'jwt-decode'; // Corrected the import
// import { useAuth } from '../../context/authContext'; // Adjust the path if needed

// const apiUrl = process.env.REACT_APP_BACKEND_URL;

// const Signin = () => {
//   const [uid, setUid] = useState(''); // Input for UID
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false); // Toggle visibility
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const { setUser } = useAuth(); // Use the context to get setUser

//   const handleSignin = async (e) => {
//     e.preventDefault();
//     try {
//       const requestData = { uid, password };

//       const { data } = await axios.post(`${apiUrl}/api/auth/signin`, requestData);

//       // Save token in local storage
//       localStorage.setItem('token', data.token);

//       // Decode token to extract user details
//       const decoded = jwtDecode(data.token);

//       // Update auth state
//       setUser({ id: decoded.id, role: decoded.role });

//       setError('');

//       // Redirect based on user role
//       switch (decoded.role) {
//         case 'admin':
//           navigate('/dashboard-admin');
//           break;
//         case 'manager':
//           navigate('/dashboard-manager');
//           break;
//         case 'accountant':
//           navigate('/dashboard-accountant');
//           break;
//         case 'user':
//           navigate('/dashboard-user');
//           break;
//         default:
//           navigate('/unauthorized');
//       }
//     } catch (err) {
//       console.error('Error:', err);
//       setError(err.response?.data?.message || 'Sign-in failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form
//         onSubmit={handleSignin}
//         className="w-full max-w-md bg-white p-8 rounded-lg shadow-md"
//       >
//         <h2 className="text-2xl font-bold text-center text-gray-800">Sign In</h2>

//         {error && (
//           <p className="mt-4 text-sm text-center text-red-500">
//             {error}
//           </p>
//         )}

//         <div className="mt-6">
//           <label className="block text-sm font-medium text-gray-700">UID</label>
//           <input
//             type="text"
//             value={uid}
//             onChange={(e) => setUid(e.target.value)}
//             placeholder="Enter your UID"
//             className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//             required
//           />
//         </div>

//         <div className="mt-4 relative">
//           <label className="block text-sm font-medium text-gray-700">Password</label>
//           <input
//             type={showPassword ? 'text' : 'password'}
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             placeholder="Enter your password"
            
//             className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
//             required
//           />
//           <button
//             type="button"
//             onClick={() => setShowPassword(!showPassword)}
//             className="absolute top-9 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
//           >
//             {showPassword ? (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-2.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
//                 />
//               </svg>
//             ) : (
//               <svg
//                 xmlns="http://www.w3.org/2000/svg"
//                 className="h-5 w-5"
//                 fill="none"
//                 viewBox="0 0 24 24"
//                 stroke="currentColor"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M3 3l18 18m-1.5-1.5A9.97 9.97 0 0112 21a10 10 0 01-9-6M16.5 7.5a9.97 9.97 0 00-4.5-2m1 1A10 10 0 0112 3a9.97 9.97 0 015.5 2.5m0 1.5a10 10 0 01.5 10.5M21 12a10 10 0 01-1.5 5.5"
//                 />
//               </svg>
//             )}
//           </button>
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
//         >
//           Sign In
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Signin;






import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Correct import
import { useAuth } from '../../context/authContext'; // Adjust path if needed
import { motion } from 'framer-motion';

const apiUrl = process.env.REACT_APP_BACKEND_URL;

const Signin = () => {
  const [uid, setUid] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { setUser } = useAuth();

  const handleSignin = async (e) => {
    e.preventDefault();
    try {
      const requestData = { uid, password };

      const { data } = await axios.post(`${apiUrl}/api/auth/signin`, requestData);

      localStorage.setItem('token', data.token);

      const decoded = jwtDecode(data.token);

      setUser({ id: decoded.id, role: decoded.role });

      setError('');

      switch (decoded.role) {
        case 'admin':
          navigate('/dashboard-admin');
          break;
        case 'manager':
          navigate('/dashboard-manager');
          break;
        case 'accountant':
          navigate('/dashboard-accountant');
          break;
        case 'user':
          navigate('/dashboard-user');
          break;
        default:
          navigate('/unauthorized');
      }
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || 'Sign-in failed');
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-900 overflow-hidden">
      {/* Background Video */}
      <motion.video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-25"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      >
        <source src="https://example.com/signin-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Form Container */}
      <motion.form
        onSubmit={handleSignin}
        className="z-10 w-full max-w-md bg-white p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-3xl font-bold text-center text-gray-800">Sign In</h2>

        {error && (
          <motion.p
            className="mt-4 text-sm text-center text-red-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {error}
          </motion.p>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700">UID</label>
          <input
            type="text"
            value={uid}
            onChange={(e) => setUid(e.target.value)}
            placeholder="Enter your UID"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
        </div>

        <div className="mt-4 relative">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-9 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-3 9c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm0-2.5a5.5 5.5 0 100-11 5.5 5.5 0 000 11z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3l18 18m-1.5-1.5A9.97 9.97 0 0112 21a10 10 0 01-9-6M16.5 7.5a9.97 9.97 0 00-4.5-2m1 1A10 10 0 0112 3a9.97 9.97 0 015.5 2.5m0 1.5a10 10 0 01.5 10.5M21 12a10 10 0 01-1.5 5.5"
                />
              </svg>
            )}
          </button>
        </div>

        <motion.button
          type="submit"
          className="mt-6 w-full py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg focus:outline-none focus:ring focus:ring-blue-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Sign In
        </motion.button>
      </motion.form>

      {/* Subtle Foreground */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Signin;
