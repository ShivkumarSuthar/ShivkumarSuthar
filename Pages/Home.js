'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function Home() {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const size = isHovered ? 400 : 40;

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* <BackgroundVideo /> */}
      <section className="main">
        <>
          <motion.div
            className="mask"
            animate={{
              WebkitMaskPosition: `${cursorPos.x - size / 3}px ${cursorPos.y - size / 3}px`,
              WebkitMaskSize: `${size}px`,
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
          >
            <p
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className='hidden-text'
            >
              <span>Hiding</span>
              <span>Bad</span>
              <span>shit</span>
              <span>since</span>
              <span>2022</span>
            </p>
          </motion.div>

          <div className="body">
            <div className='my-info'>
              <span className="casual-greeting">Hi,</span>
              <div className="name">I Am <span className='first-name red'>Shivkumar</span> <span className='last-name red'>suthar</span> </div>
              <span className='and'>&</span>
            </div>
            <div className='visual-text'>
              <span>Making</span>
              <span className='red'>Good</span>
              <span className='red'>shit</span>
              <span>since</span>
              <span>2022</span>
            </div>
          </div>
        </>
      </section>
    </>
  );
}

export default Home;