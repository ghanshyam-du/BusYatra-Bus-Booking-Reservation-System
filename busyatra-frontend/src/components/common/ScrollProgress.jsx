
import React from 'react';
import { motion, useScroll } from 'framer-motion';

const ScrollProgress = () => {
    const { scrollYProgress } = useScroll();

    return (
        <motion.div
            className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-orange-500 to-yellow-500 origin-left z-50 shadow-[0_0_10px_rgba(249,116,21,0.5)]"
            style={{ scaleX: scrollYProgress }}
        />
    );
};

export default ScrollProgress;
