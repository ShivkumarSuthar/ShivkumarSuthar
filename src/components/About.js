import { memo, useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import CustomCursor from './CustomCursor';


const Hero = ({ className, id }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = CustomCursor();
  const size = isHovered ? 400 : 40;
  const textRef = useRef(null);


  return (
    <section className={`main-about about-page ${className}`} id={id}>
      <motion.div
        className="mask-about"
        animate={{
          WebkitMaskPosition: `${x - (size / 3)}px ${y - (size / 3)}px`,
          WebkitMaskSize: `${size}px`,
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.3 }}
      >
        <p
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="hidden-text-about"
        >
          A Frontend + Backend Developer - with skills that haven't been replaced by A.I (yet) - making good shit only if your interest is equally good.
        </p>
      </motion.div>

      <div className="body-about">
        <p className="my-info-about">About Me</p>
        <p className="visual-text-about" id="textSection" ref={textRef}>
          I'm a <span className="red">selectively skilled</span> MERN stack Developer with a strong focus on producing high-quality & impactful web experiences.
        </p>
      </div>
    </section>
  );
};

export default memo(Hero);
