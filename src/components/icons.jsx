import React from 'react'
import { FaDribbble, FaInstagram, FaLinkedinIn, FaPlay } from 'react-icons/fa'
import { GiAnimalSkull } from 'react-icons/gi';


function Icons() {
  return (
    <div className=" flex flex-col justify-between h-screen py-[3%]">
      
        <span className="text-white text-[30px] cursor-pointer">
          <GiAnimalSkull />
        </span>
      
      <div className=" flex flex-col text-[#b7ab98]">
        <span className="my-3 text-[25px] cursor-pointer">
          <FaLinkedinIn />
        </span>
        <span className="my-3 text-[25px] cursor-pointer">
          <FaInstagram />
        </span>
        <span className="my-3 text-[25px] cursor-pointer">
          <FaPlay />
        </span>
        <span className="my-3 text-[25px] cursor-pointer">
          <FaDribbble />
        </span>
      </div>
    </div>
  );
}

export default Icons