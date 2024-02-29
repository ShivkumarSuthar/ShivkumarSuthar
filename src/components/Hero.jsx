import React from "react";
import Video from "./Video";
import HeroText from "./HeroText";

function Hero() {
  return (
    <>
      <div className="absolute">
       <Video/>
      </div>
      
   <section className='w-100 h-screen relative flex justify-center '>
    <div className=" w-1/5 bg-white">d</div>
    <div className=" w-4/5">
<HeroText/>
    </div>
    <div className="w-1/5 bg-teal-100">df</div>
   </section>
    </>
  );
}

export default Hero;
