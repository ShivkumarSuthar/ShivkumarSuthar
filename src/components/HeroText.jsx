import React from "react";

function HeroText() {
  return (
    <div>
      <div className="h-screen flex flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center text-[#b7ab98] font-myron uppercase text-2xl">
            <p>I<span className=" font-myron text-[#eb5939] text-3xl">'</span>am</p>
            <span>Shivkumar Suthar</span>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className=" font-ITCAvantGardeStd text-3xl font-bold uppercase text-[110px] leading-[85%] tracking-tighter text-[#b7ab98]">
            <span>m</span>
            <span>a</span>
            <span>k</span>
            <span>i</span>
            <span>n</span>
            <span>g</span>
          </div>
          <div className="tracking-tighter font-ITCAvantGardeStd text-3xl font-bold uppercase text-[110px] leading-[85%] text-[#eb5939]">
            <span>g</span>
            <span>o</span>
            <span>o</span>
            <span>d</span>
          </div>
          <div className="tracking-tighter font-ITCAvantGardeStd text-3xl font-bold uppercase text-[110px] leading-[85%] text-[#eb5939]">
            <span>s</span>
            <span>h</span>
            <span>i</span>
            <span>t</span>
          </div>
          <div className="tracking-tighter font-ITCAvantGardeStd text-3xl font-bold uppercase text-[110px] leading-[85%] text-[#b7ab98]"> 
            <span>S</span>
            <span>i</span>
            <span>n</span>
            <span>c</span>
            <span>e</span>
          </div>
          <div className="tracking-tighter font-ITCAvantGardeStd text-3xl font-bold uppercase text-[110px] leading-[85%] text-[#b7ab98]">
            <span>2</span>
            <span>0</span>
            <span>2</span>
            <span>2</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeroText;
