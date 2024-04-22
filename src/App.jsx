import React from "react";
import Hero from "./components/Hero";
import TimeLine from "./components/TimeLine";
import About from "./components/About";
import WhatIDo from "./components/WhatIDo";
import Experience from "./components/Experience";
import ContactUs from "./components/ContactUs";
import SkillTab from "./components/SkillTab";

function App() {
  return (
    <div className="app">
      <Hero />
      <About/>
      <WhatIDo/>
      <SkillTab/>
      <Experience/>
      <TimeLine/>
      <ContactUs />
    </div>
  );
}

export default App;
