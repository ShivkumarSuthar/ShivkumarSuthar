import { memo, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import CustomCursor from './CustomCursor';
import BackgroundVideo from './BackgroundVideo';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger'; // Example plugin
const Hero = ({className, id}) => {

  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = CustomCursor();
  const size = isHovered ? 400 : 40;


  
  return (
    <>
      <BackgroundVideo />
      <section className={"main " + className} id={id}>
        <>
          <motion.div
            className="mask"
            animate={{
              WebkitMaskPosition: `${x - (size / 3)}px ${y - (size / 3)}px`,
              WebkitMaskSize: `${size}px`,
            }}
            transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
          >
            <p onMouseEnter={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }} className='hidden-text'>
              <span>Hiding</span>
              <span>Bad</span>
              <span>shit</span>
              <span>since</span>
              <span>2022</span>
            </p>
          </motion.div>

          <div className="body">
            <p className='my-info'>
              <span className="casual-greeting">Hi,</span>
              <p className="name">I Am <span className='first-name red'>Shivkumar</span> <span className='last-name red'>suthar</span> </p>
              <span className='and'>&</span>
            </p>
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
  )
}
export default memo(Hero)