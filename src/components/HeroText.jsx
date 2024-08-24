import { memo, useState } from 'react';
import { motion } from 'framer-motion';
import CustomCursor from './CustomCursor';
import BackgroundVideo from './BackgroundVideo';

const Hero = () => {

  const [isHovered, setIsHovered] = useState(false);
  const { x, y } = CustomCursor();
  const size = isHovered ? 400 : 40;

  return (
    <>
      <BackgroundVideo />
      <section className='main'>
        <motion.div
          className="mask"
          animate={{
            WebkitMaskPosition: `${x - (size / 3)}px ${y - (size / 3)}px`,
            WebkitMaskSize: `${size}px`,
          }}
          transition={{ type: "tween", ease: "backOut", duration: 0.3 }}
        >

          <p onMouseEnter={() => { setIsHovered(true) }} onMouseLeave={() => { setIsHovered(false) }} className='hidden-text'>
            A Frontend + Backend Developer - with skills that haven't been replaced by A.I (yet) - making good shit only if the your Interest is equally good.
          </p>
        </motion.div>
       
        <div className="body">
          <p className='my-info'>
            
              {/* <span className="casual-greeting">Hi,</span>
              <p className="name">I Am <span className='first-name'>Shivkumar</span> <span className='last-name'>suthar</span></p> */}
             About Me
           
          </p>
          <p className='visual-text'>I'm a <span>selectively skilled</span> MERN stack Developer with strong focus on producing high quality & impactful Web experience.</p>
        </div>

      </section>
    </>
  )
}
export default memo(Hero)