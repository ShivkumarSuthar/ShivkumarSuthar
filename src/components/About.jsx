import React from "react";

function About() {
  return (
    <section className="h-screen w-screen bg-black text-white">
      <div className=" px-[15%] flex items-center h-full">
        <div>
          <h1 className="font-hertical  text-[20px] tracking-widest pb-5 ">About me</h1>
          <div className=" font-hertical  font-black   text-[65px]  ">
            <div>
              <p className=" leading-[99%]">
                <span>I'm </span> <span>a </span>
                <span className=" text-orange-500">selectively </span> 
                <span className="text-orange-500">skilled </span>
               
              </p>
            </div>
            <div>
            <p className=" leading-[99%]">
            <span>Frontend </span>
                <span>Developer</span> <span>with </span>
                <span>strong </span>
                <span>focus </span>
                <span>on </span>
                <span>producing </span>
              </p>
            </div>
            <div>
            <p className=" leading-[98%]">
                <span>high </span>
                <span>quality </span>
                <span>& </span>
                <span>impactful </span>
              </p>
            </div>
            <div>
            <p className=" leading-[98%]">
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
