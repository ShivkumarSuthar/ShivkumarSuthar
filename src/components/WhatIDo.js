import React from "react";

function WhatIDo() {
  return (
    <section className="bg-black h-screen text-white px-[15%]">
      <div className=" h-full flex flex-col justify-center">
        <h1 className=" font-hertical text-[15px]">
          What I do
        </h1>
        <div className="font-hertical text-[120px] leading-[95%]">
          <div className="flex items-center ">
            <p className=" tracking-tighter uppercase">
              3D
            </p>
          </div>
          <div className="flex items-center ">
            <p className="  tracking-tighter uppercase ">
              Visual
            </p>
          </div>
          <div className="flex items-center">
            <p className="   tracking-tighter uppercase ">
              Motion
            </p>
          </div>

          <div className="flex items-center">
            <p className="  tracking-tighter uppercase ">
              tutorial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatIDo;
