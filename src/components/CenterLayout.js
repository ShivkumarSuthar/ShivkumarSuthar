import React, { useLayoutEffect } from 'react';
import Hero from "./Hero";
import TimeLine from "./TimeLine";
import About from "./About";
import SkillTab from "./SkillTab";
import Experience from './Experience';
import ContactUs from './ContactUs';
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import ScrollToPlugin from "gsap/ScrollToPlugin";
import { ScrollSmoother } from 'gsap-trial/all';
import Contact from './Contact';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);

function CenterLayout() {
  // useLayoutEffect(() => {
  //   const smoother = ScrollSmoother.create({
  //     wrapper: '.smooth-wrapper',
  //     content: '.smooth-content',
  //   });

  //   gsap.utils.toArray('.panel').forEach((panel, i, panels) => {
  //     ScrollTrigger.create({
  //       trigger: panel,
  //       start: 'top 5%',
  //       onEnter: () => {
  //         if (i < panels.length - 1) {
  //           gsap.to(window, {
  //             scrollTo: { y: panels[i + 1], autoKill: false },
  //             duration: 1
  //           });
  //         }
  //       },
  //     });
  //   });

  //   return () => {
  //     if (smoother) smoother.kill();
  //     ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  //   };
  // }, []);

  return (
    <section className='center-section smooth-wrapper'>
      <div className='smooth-content'>
        <Hero className="panel" id="hero"/>
        <hr/>
        <About className="panel" id="about"/>
        <hr/>
        <SkillTab className="panel" id="skills"/>
        {/* <WhatIDo /> */}
        <TimeLine />
        <Experience className="panel" id="experience"/>
        <hr/>
        {/* <ContactUs className="panel" id="contact"/> */}
        <Contact className="panel" id="contact"/> 
      </div>
    </section>
  );
}

export default CenterLayout;
