import React from "react";
import skillsList from "./dataList.json";

function SkillTab({className, id}) {
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
        {skillsList.skills?.map((skill, index) => (
          <span
            key={index}
            className="skillItem"
          >
            <img
              src={skill.img}
              alt={skill.title}
              className="skillImage"
            />
          </span>
        ))}
      </div>
    </section>
  );
}

export default SkillTab;
