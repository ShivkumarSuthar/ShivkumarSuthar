import React from 'react'

function DownloadResume() {
  return (
    <svg viewBox='0 0 100 50' width='220' height='110' fill='none'>
    <circle cx='20'cy='35' r='8.5' fill='#00cffc' class='mainCircle'></circle>
    <circle cx='20' cy='35' r='8.05' stroke='#00cffc' stroke-width='.9' fill='url(#gradient)' class='mainCircleFill'></circle>
    <rect x='17.5' y='32.5' width='5' height='5' stroke='none' fill='#00cffc' class='rect'></rect>
    <path d='M20,39 l3.5,-3.5 l0,0 M20,39 l-3.5,-3.5 l0,0 M20,39 l0,-7.5' stroke='#fff' stroke-linecap='round' stroke-width='.8' class='arrow'></path>
    <text x='55' y='36.5' fill='#fff' text-anchor='middle' font-size='5.5' font-family='Roboto' letter-spacing='.2' class='text'>Download Resume</text>
    <path d='M50,25 h30 a10,10 0 0,1 10,10 a10,10 0 0,1 -10,10 s-30,0 -60,0 a10,10 0 0,1 -10,-10 a10,10 0 0,1 10,-10 h30' stroke='#00cffc' stroke-width='.7' fill='transparent' class='btn'></path>
    <circle cx='20' cy='35' r='7.9' fill='#fff' fill-opacity='0' stroke='#fff' stroke-width='1.6' stroke-opacity='0' class='subCircle'></circle>
    <circle cx='50' cy='26' r='0' fill='#fff' class='dot'></circle>
    <linearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
      <stop offset='98%' class='gradient' stop-color='transparent'/>
      <stop offset='98%' class='gradient' stop-color='#00afd3'/>
    </linearGradient>
  </svg>
  )
}

export default DownloadResume