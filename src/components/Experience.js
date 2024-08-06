import React from "react";
import dataList from "./dataList.json";

function Experience({className, id}) {
  return (
    <>
      <section className={"container-experience experienceSection "+ className} id={id}>
        <div className="h-full flex flex-col justify-center relative">
          <h1 className="experienceTitle">
          Experience
          </h1>

          <div>
            <p className="experienceDescription">
              Over <span className="highlightText">two Years</span> of
              experience in Front-end Development and working with some of the most
              talented people in the Industry.
            </p>
          </div>
          <div className="historySection">
            <h1 className="historyTitle">
             Work History
            </h1>
          </div>
        </div>
      </section>

      <section className="container-experience workHistorySection">
        <div className="h-full">
          {dataList?.work_history?.map((item, index) => (
            <div className="workHistoryItem" key={index}>
              <div className="date">
                <span>{item.last_day}</span>
              </div>
              <div className="details">
                <span className="profile">
                  {item.profile}
                </span>
                <span className="organization">
                  {item.organizationName}
                </span>
                <span className="location">
                  {item.location}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
{/* 
      <div class="timeline">
        {dataList?.work_history?.map((item, index) => (
          <div class="timeline__event  animated fadeInUp delay-3s timeline__event--type1" key={index}>
            <div class="timeline__event__icon ">
              <i class="lni-sport"></i>

            </div>
            <div class="timeline__event__date">
              {item.last_day}
            </div>
            <div class="timeline__event__content ">
              <div class="timeline__event__title">
                {item.profile}
              </div>
              <div class="timeline__event__description">
                <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vel, nam! Nam eveniet ut aliquam ab asperiores, accusamus iure veniam corporis incidunt reprehenderit accusantium id aut architecto harum quidem dolorem in!</p>
                <span className="location">{item.location}</span>
              </div>
            </div>
          </div>))}
      </div> */}

    </>
  );
}

export default Experience;
