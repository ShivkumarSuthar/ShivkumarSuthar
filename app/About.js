'use client';

import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';

// Dynamically import GSAP and ScrollTrigger
// const gsap = dynamic(() => import('gsap'), { ssr: false });
// const ScrollTrigger = dynamic(() => import('gsap/ScrollTrigger'), { ssr: false });

// Dynamically import CustomCursor
// const CustomCursor = dynamic(() => import('./CustomCursor'), { ssr: false });

const Hero = ({ className, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const size = isHovered ? 400 : 40;
  const textRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // useEffect(() => {
  //   if (typeof window !== 'undefined') {
  //     gsap.registerPlugin(ScrollTrigger);
  //     // Your GSAP animations here
  //   }
  // }, []);

  return (
    <section className={`main-about about-page ${className}`} id={id}>
      {/* <div
        className="mask-about"
        // animate={{
        //   WebkitMaskPosition: `${cursorPos.x - (size / 3)}px ${cursorPos.y - (size / 3)}px`,
        //   WebkitMaskSize: `${size}px`,
        // }}
        // transition={{ type: 'tween', ease: 'backOut', duration: 0.3 }}
      >
        <p
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden-text-about"
        >
          A Frontend + Backend Developer - with skills that havent been replaced by A.I (yet) - making good shit only if your interest is equally good.
        </p>
      </div> */}

      <div className="body-about">
        <p className="my-info-about">About Me</p>
        <p className="visual-text-about" id="textSection">
          Im a <span className="red">selectively skilled</span> MERN stack Developer with a strong focus on producing high-quality & impactful web experiences.
        </p>
      </div>
    </section>
  );
};

export default memo(Hero);