import React from 'react'
import { FaLinkedinIn } from "react-icons/fa6";
import { FaPlay } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaDribbble } from "react-icons/fa";

function icons() {
  return (
    <div className=''>
        <div>
            <span><FaLinkedinIn /></span> 
            <span><FaPlay /></span>
            <span><FaInstagram /></span>
            <span><FaDribbble /></span>
        </div>
    </div>
  )
}

export default icons