import React from "react";
import Video from "./Video";
import HeroText from "./HeroText";
import Icons from "./icons";
import Sound from "./Sound";

function Hero() {
  return (
    <>
      <div className="absolute w-screen h-screen">
        <Video />
      </div>

      <section className="w-screen h-screen relative px-[2%]">
        <div className="flex justify-between items-end">
          <div>
          <Icons />
          </div>

          <div>
            <HeroText />
          </div>

          <div>
          <Sound />
          </div>
        </div>
      </section>
    </>
  );
}

export default Hero;
