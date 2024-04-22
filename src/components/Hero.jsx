import React from "react";
import Video from "./Video";
import HeroText from "./HeroText";
import Icons from "./icons";
import Logo from "../assets/images/logo.png";
import { CiMenuFries } from "react-icons/ci";
import { GiAnimalSkull } from "react-icons/gi";
import Sound from "./Sound";

function Hero() {
  return (
    <>
      <div className="absolute w-screen h-screen">
        <Video/>
      </div>

      <section className="w-screen h-screen relative flex flex-col justify-center">
        <div className="flex justify-between h-[100px] items-center mt-20 px-[2%] ">
          <span className="text-white text-[30px] cursor-pointer">
            <GiAnimalSkull />
          </span>
          <span className="text-white text-[30px] cursor-pointer">
            <CiMenuFries />
          </span>
        </div>

        <div className="flex justify-between">
          <div className="flex items-end pb-[7%] px-[2%]">
            <Icons />
          </div>
          <div className="flex items-center">
            <HeroText />
          </div>
          <div className="flex items-end pb-[10%]  justify-end">
            <Sound />
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
