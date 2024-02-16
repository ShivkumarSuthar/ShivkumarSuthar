import React from "react";
import { FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { LuGithub } from "react-icons/lu";
import { FiInstagram } from "react-icons/fi";

function Social() {
  return (
    <div>
      <div className="flex justify-center   h-[12svh]">
        <div className="flex  justify-around ">
          <div className="w-[60px] ">
            <a href="#">
              <span className=" text-3xl">
                <LuGithub />
              </span>
            </a>
          </div>
          <div className="w-[60px]">
            <a href="#">
              <span className=" text-3xl">
                <FaFacebookF />
              </span>
            </a>
          </div>
          <div className="w-[60px]">
            <a href="#">
              <span className=" text-3xl">
                <FiInstagram />
              </span>
            </a>
          </div>
          <div className="w-[60px]">
            <a href="">
              <span className=" text-3xl">
                <FaXTwitter />
              </span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Social;
