import React, { useState } from "react";

function Sound() {
  const [on, seton] = useState(false);
  return (
    <div className="flex  text-white  justify-end">
      <div className="font-hertical  flex flex-col ">
            <button className="mx-3 w-[70px] h-[30px] border-[1px] border-black rounded-full bg-slate-100 text-black -rotate-90" onClick={() => seton(!on)}>{on ? "ON" : "OFF"}</button>
        <span className=" -rotate-90 mt-[30px]" >sound</span>
      </div>
    </div>
  );
}

export default Sound;
