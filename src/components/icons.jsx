import React from 'react'
import { FaDribbble, FaInstagram, FaLinkedinIn, FaPlay } from 'react-icons/fa'


function Icons() {
  return (
    <div className=''>
        <div className=' flex flex-col text-[#b7ab98]'>
            <span className='my-3 text-[25px] cursor-pointer'><FaLinkedinIn /></span> 
            <span className='my-3 text-[25px] cursor-pointer' ><FaInstagram /></span>
            <span className='my-3 text-[25px] cursor-pointer' ><FaPlay /></span>
            <span className='my-3 text-[25px] cursor-pointer' ><FaDribbble /></span>
        </div>
    </div>
  )
}

export default Icons