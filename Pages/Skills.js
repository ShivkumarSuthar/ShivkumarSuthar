'use client'
import React from "react";
import  dataList  from "@/public/assets/dataList";
import Image from 'next/image';



function Skills({className, id}) {
  return (
    <section className={"container " +className} id={id}>
      <div className="headerText">
        <h1 className="mainTitle">
          Milestones and Skills Achievements
        </h1>
        <h1 className="subTitle">
          I can <span className="highlightText">work</span> with
        </h1>
        <h3 className="masteryText">
          area of mastery...
        </h3>
      </div>
      <div className="skillContainer">
        {dataList?.skills?.map((skill, index) => (
          <span
            key={index}
            className="skillItem"
          >
            <Image
              src={skill.img}
              alt={skill.title}
              className="skillImage"
              width={100}
              height={100}
            />
          </span>
        ))}
        
        
      </div>
    </section>
  );
}


export default Skills;
