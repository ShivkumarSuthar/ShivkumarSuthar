import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import loaderSvg from './loader/loading-1.svg';
import loaderSvg2 from './loader/loading-2.svg'
import loadersvg3 from "./loader/loading-3.svg"
import loadersvg4 from "./loader/loading-4.svg"
import loadersvg5 from "./loader/loading-5.svg"

function Loading() {
  useEffect(() => {
    gsap.to('.loader1', {
      rotation: 360,
      duration: 3,
      repeat: -1,
      ease: 'linear'
    });
    gsap.to('.loader2', {
        rotation: -360,
        duration: 5,
        repeat: -1,
        ease: 'linear'
      });
  }, []);

  return (
    <div className='loader'>
      <img src={loaderSvg} alt='loader' className='loader1' />
      <img src={loaderSvg2} alt='loader' className='loader2' />
      <img src={loadersvg3} alt='loader' className='loader3' />
      <img src={loadersvg4} alt='loader' className='loader4' />
      <img src={loadersvg5} alt='loader' className='loader5' />
    </div>
  );
}

export default Loading;
