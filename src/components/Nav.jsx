import React from "react";
import { FiBarChart2 } from "react-icons/fi";
function Nav() {
    return (
        <div className="w-full flex justify-between h-[10svh]">
            <div>
                <span className="text-2xl font-lemon_milk_B">Mr.<br/>Str</span>
            </div>
            <div>
                <span className="text-[25px] sm:text-[32px] lg:text-[40px] cursor-pointer">
                    <FiBarChart2 className="text-white -rotate-90"/>
                </span>
            </div>
        </div>
    );
}

export default Nav;
