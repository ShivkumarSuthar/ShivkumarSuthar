import React from "react";

function About() {
  return (
    <section className="h-screen w-screen bg-black text-white">
      <div className="pl-[17%] pr-[17%] pt-[12%] pb-[12%]">
        <div>
          <h1 className=" font-athena font-bold uppercase text-[20px] tracking-widest pb-5 ">About me</h1>
          <div className=" font-myron    text-[65px] font-black ">
            <div>
              <p className=" leading-[99%]">
                <span>I'm </span> <span>a </span>
                <span className=" text-orange-500">selectively </span> 
                <span className="text-orange-500">skilled </span>
                <span>Frontend</span>
              </p>
            </div>
            <div>
            <p className=" leading-[99%]">
                <span>Developer</span> <span>with </span>
                <span>strong </span>
                <span>focus </span>
                <span>on</span>
              </p>
            </div>
            <div>
            <p className=" leading-[98%]">
                <span>producing </span>
                <span>high </span>
                <span>quality </span>
                <span>&</span>
              </p>
            </div>
            <div>
            <p className=" leading-[98%]">
                <span>impactful </span>
                <span>digital </span>
                <span>experience.</span>{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
