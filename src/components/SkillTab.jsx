import React from "react";
import html from "../assets/images/icons/html.png";
import css from "../assets/images/icons/css.png";
import js from "../assets/images/icons/js.png";
import bootstrap from "../assets/images/icons/bootstrap.png";
import github from "../assets/images/icons/github.png";
import sass from "../assets/images/icons/sass.png";
import tailwind from "../assets/images/icons/tailwind.png";
import vue from "../assets/images/icons/vue.png";
import node from "../assets/images/icons/node.png";
import java from "../assets/images/icons/java.png";
import react from "../assets/images/icons/react.png";
const skillsList = [
  {
    img: html,
    tittle: "html",
  },
  {
    img: css,
    tittle: "css",
  },
  {
    img: js,
    tittle: "js",
  },
  {
    img: react,
    tittle: "react",
  },
  {
    img: vue,
    tittle: "vue",
  },
  {
    img: node,
    tittle: "node",
  },
  // {
  //   img: java,
  //   tittle: "java",
  // },
  {
    img: tailwind,
    tittle: "tailwind",
  },
  {
    img: bootstrap,
    tittle: "bootstrap",
  },
  {
    img: github,
    tittle: "Source Control",
  },

  {
    img: sass,
    tittle: "sass",
  },
];

function SkillTab() {
  return (
    <section className="h-screen bg-black flex flex-col items-center justify-center">
      <div className="text-center">
        <h1 className="text-red-700 font-hertical text-[40px]">
          Milestones and skills Achievements
        </h1>
        <h1 className="text-gray-300 font-hertical text-[30px]">
          What I <span className="text-teal-300">can</span> DO
        </h1>
        <h3 className="text-teal-300 font-mandala text-[25px]">
          area of mastery...
        </h3>
      </div>
      <div className="flex flex-wrap justify-center gap-5 pt-10 px-[20%]">
        {skillsList.map((skill, index) => (
          <span
            key={index}
            className="w-[150px] h-[150px] bg-slate-600 flex flex-col items-center justify-center rounded-md"
          >
            <img
              src={skill.img}
              alt={skill.tittle}
              className="w-[100px] h-[100px] object-contain"
            />
            <span className=" text-blue-400 font-hertical text-[10px] pt-3">
             {skill.tittle}
            </span>
          </span>
        ))}
      </div>
    </section>
  );
}

export default SkillTab;
