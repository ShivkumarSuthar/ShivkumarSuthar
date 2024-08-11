import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Hero from "./Hero";
import About from "./About";
import Experience from './Experience';
// import Projects from './Projects';
import SkillTab from "./SkillTab";
import Contact from './Contact';

function CenterLayout() {
  const location = useLocation();

  return (
    <section className='center-section smooth-wrapper'>
      <div className='smooth-content'>
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Hero />} />
          <Route path="/about" element={<About />} />
          <Route path="/experience" element={<Experience />} />
          {/* <Route path="/projects" element={<Projects />} /> */}
          <Route path="/skills" element={<SkillTab />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </section>
  );
}

export default CenterLayout;