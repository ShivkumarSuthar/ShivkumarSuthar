import React from 'react';
import { FaDribbble, FaInstagram, FaLinkedinIn, FaPlay } from 'react-icons/fa';
import { GiAnimalSkull } from 'react-icons/gi';

function LeftLayout() {
  return (
    <div className="left-menu">
      <div className="logo-div">
        <GiAnimalSkull className='logo'/>
      </div>

      <div className='social-media-icons'>
        <FaLinkedinIn className='icon'  />
        <FaInstagram className='icon' />
        <FaPlay className='icon'  />
        <FaDribbble className='icon' />
      </div>
    </div>
  );
}

export default LeftLayout;
