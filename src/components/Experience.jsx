import React from "react";

const history = [
  {
    LastDay: "Present",
    organizationName: "Ram's Cretive Technology Pvt. Ltd.",
    profile:"React Developer",
    location: "jaipur",
    joinDate: "Jan 2024",
  },
  {
    LastDay: "2024",
    organizationName: "Viseven Pvt. Ltd",
    profile:"Frontend Developer",
    location: "jaipur",
    joinDate: "August 2022",
  },
  {
    LastDay: "2022",
    organizationName: "Mumbai University",
    profile:"Bachelor of Science in Information Technology",
    location: "Mumbai Maharashtra",
    joinDate: "july 2019",
  },
];
function Experience() {
  return (
    <>
      <section className="bg-black h-screen text-white experience">
        <div className="pl-[18%] pt-[8%] h-full">
          <h1 className=" font-lemon_milk_m uppercase text-[15px] tracking-wider">
            experience
          </h1>

          <div>
            <p className="text-[70px] font-black font-wes leading-[120%] pt-5">
              Over <span className="text-red-500">two Years </span> of
              experience in intractive design and working with some of the most
              talented people in the Industry.
            </p>
          </div>
          <div className="pt-[13%]">
            <h1 className=" font-lemon_milk_m uppercase text-[15px] tracking-wider">
              History
            </h1>
          </div>
        </div>
      </section>

      <section className="h-screen bg-black text-white">
        <div className="h-full">
            {history.map((item,index)=>(

                <div className="flex border-y-[1px] border-gray-500 pl-[18%] py-5 w-full" key={index}>
            <div className="w-[25%]">
              <span className=" font-ITCAvantGardeStd font-bold text-[45px]">
              {item.LastDay}
              </span>
            </div>
            <div className="flex flex-col items-start">
              <span className=" font-ITCAvantGardeStd font-bold text-[35px]">
                {item.profile}
              </span>
              <span>{item.organizationName}</span>
              <span>{item.location}</span>
            </div>
          </div>
        ))}
        </div>
      </section>
    </>
  );
}

export default Experience;
