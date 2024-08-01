import React from 'react'
import Hero from "./Hero";
import TimeLine from "./TimeLine";
import About from "./About";
import WhatIDo from "./WhatIDo";
import Experience from "./Experience";
import ContactUs from "./ContactUs";
import SkillTab from "./SkillTab";
function CenterLayout() {
  return (
    <section className='center-section'>
      <Hero />
      <About />
      <SkillTab />
      {/* <WhatIDo /> */}
      {/* <TimeLine /> */}
      {/* <Experience /> */}
      <ContactUs />
    </section>
  )
}

export default CenterLayout