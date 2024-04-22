import React, { useState } from "react";
import soundFile from "../assets/music/BACKGROUND MUSIC.mp3"; // Replace this with the path to your sound file
import { CiMenuFries } from "react-icons/ci";

function Sound() {
  const [on, setOn] = useState(false);

  const toggleSound = () => {
    setOn(!on);
  };

  return (
    <div className="flex flex-col text-white justify-between items-end h-screen py-[3%]">
      <span className="text-white text-[30px] cursor-pointer">
        <CiMenuFries />
      </span>

      <div className="font-hertical flex flex-col items-end">
        <button
          className=" w-[30px] h-[70px] border-[1px] border-black rounded-full bg-slate-100 text-black"
          onClick={toggleSound}
        >
          <span className=" -rotate-90">{on ? "ON" : "OFF"}</span>
        </button>
        <span className="-rotate-90 font-hertical text-[20px] mt-3 pt-[43px] ">
          sound
        </span>
      </div>

      {on && <audio src={soundFile} autoPlay loop />}
    </div>
  );
}

export default Sound;
