
import React from 'react';
import { motion } from 'framer-motion';

const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full">
      <div className="relative w-16 h-16 mb-4">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 rounded-full border-4 border-white/5 border-t-primary absolute top-0 left-0"
        />
        {/* Inner Ring */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 rounded-full border-4 border-white/5 border-t-orange-600 absolute top-3 left-3"
        />
        {/* Center Dot */}
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-2 h-2 bg-primary rounded-full absolute top-7 left-7 shadow-[0_0_10px_rgba(249,116,21,0.8)]"
        />
      </div>
      <motion.p
        initial={{ opacity: 0.5 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
        className="text-gray-400 font-medium text-sm tracking-wider uppercase"
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default Loading;