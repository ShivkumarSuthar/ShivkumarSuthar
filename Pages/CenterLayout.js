'use client'
import React from 'react';
import Home from './Home';
import About from '@/app/About';
import Skills from './Skills';
import Experience from './Experience';
import ProjectTimeLine from './ProjectTimeLine';
import Contact from './Contact';
import { Imprima } from 'next/font/google';
import Link from 'next/link';
import ScrollSection from './ScrollSection';



function CenterLayout() {
//   const location = useLocation();

  return (
    <section className='center-section smooth-wrapper'>
      <div className='smooth-content'>
        <Home/>
        <About/>
        <Skills/>
        <ProjectTimeLine/>
        {/* <ScrollSection/> */}
        <Experience/>
        <Contact/>
      </div>
    </section>
  );
}

export default CenterLayout;