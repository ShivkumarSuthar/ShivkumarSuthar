import React from 'react'
import { HiArrowLongDown } from "react-icons/hi2";
function Scroll() {
  return (
  
      <div className="h-[10svh] flex  justify-end items-end">

          <div className=" flex flex-col justify-center items-center">
            <span className="scroll uppercase font-Adequate text-[10px] tracking-[5px]">scroll</span>
            <span className="scroll-icon pt-2 text-2xl">

            <HiArrowLongDown />
            </span>
          </div>
      </div>
        
    
  )
}

export default Scroll