import React from 'react';
import { motion } from 'framer-motion';

const Unauthorized = () => {
  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gray-800 overflow-hidden">
      {/* Animated Background */}
      <motion.video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover opacity-25"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <source src="https://example.com/locked-background.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </motion.video>

      {/* Content */}
      <motion.div
        className="z-10 text-center text-white"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <motion.h1
          className="text-6xl font-extrabold tracking-tight drop-shadow-lg"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          Access Denied
        </motion.h1>
        <motion.p
          className="mt-4 text-lg text-gray-300 drop-shadow-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          You are not authorized to view this page.
        </motion.p>
        <motion.div
          className="mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
        >
          <a
            href="/signin"
            className="inline-block px-6 py-3 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-300"
          >
            Go to Sign-in
          </a>
        </motion.div>
      </motion.div>

      {/* Subtle Animated Foreground */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black opacity-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </div>
  );
};

export default Unauthorized;