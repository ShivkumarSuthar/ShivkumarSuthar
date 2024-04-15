import React from 'react'

function Moto() {
  return (
    <section className="moto h-screen pt-[10%] text-white">
      <div className='flex items-center flex-col'>
        <h1 className=' font-bold font-hertical uppercase text-[15px]'>My Moto</h1>
        <p className='  text-[60px] font-mandala px-[10%] text-center font-light pt-[5%]'>
          “For me, it matters that we drive technology as an equalizing force,
          as an enabler for everyone around the world.”
        </p>
        <span className='text-[15px] font-light font-hertical tracking-widest uppercase ' ><span className='text-red-500'>–</span> Sundar Pichai
        </span>
      </div>
    </section>
  );
}

export default Moto 