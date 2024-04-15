import React from "react";

function WhatIDo() {
  return (
    <section className="bg-black h-screen text-white">
      <div className="pl-[18%] pt-[8%] h-full">
        <h1 className=" font-ITCAvantGardeStd uppercase text-[20px]">
          What I do
        </h1>
        <div>
          <div className="flex items-center leading-[100px]">
            <p className="font-ITCAvantGardeStd text-[98px] font-bold tracking-tighter uppercase h-fit">
              3D
            </p>
          </div>
          <div className="flex items-center leading-[100px]">
            <p className="font-ITCAvantGardeStd text-[98px] font-bold tracking-tighter uppercase ">
              Visual
            </p>
          </div>
          <div className="flex items-center leading-[100px]">
            <p className="font-ITCAvantGardeStd text-[98px] font-bold tracking-tighter uppercase ">
              Motion
            </p>
          </div>

          <div className="flex items-center leading-[100px]">
            <p className="font-ITCAvantGardeStd text-[98px] font-bold tracking-tighter uppercase ">
              tutorial
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhatIDo;
