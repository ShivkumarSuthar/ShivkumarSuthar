import React from "react";

const history = [
  {
    LastDay: "Present",
    organizationName: "Ram's Cretive Technology Pvt. Ltd.",
    profile: "React Developer",
    location: "jaipur",
    joinDate: "Jan 2024",
  },
  {
    LastDay: "2024",
    organizationName: "Viseven Pvt. Ltd",
    profile: "Frontend Developer",
    location: "jaipur",
    joinDate: "August 2022",
  },
  {
    LastDay: "2022",
    organizationName: "Mumbai University",
    profile: "Bachelor of Science in Information Technology",
    location: "Mumbai Maharashtra",
    joinDate: "july 2019",
  },
];
function Experience() {
  return (
    <>
      <section className="bg-black h-screen text-white experience">
        <div className="px-[15%] flex flex-col justify-center  h-full relative">
          <h1 className=" font-hertical uppercase text-[15px] tracking-[10px]">
            experience
          </h1>

          <div>
            <p className="text-[70px] font-black font-ganeta2  leading-[120%] pt-5 capitalize">
              Over <span className="text-red-500">two Years </span> of
              experience in intractive design and working with some of the most
              talented people in the Industry.
            </p>
          </div>
          <div className="absolute bottom-5">
            <h1 className="font-hertical uppercase text-[20px] tracking-wider">
              History
            </h1>
          </div>
        </div>
      </section>

      <section className="h-screen bg-black text-white">
        <div className="h-full">
          {history.map((item, index) => (

            <div className="flex border-b-[1px] border-red-900/50 px-[15%] py-8 w-full" key={index}>
              <div className="w-[20%] pt-5">
                <span className=" font-hertical text-[25px]">
                  {item.LastDay}
                </span>
              </div>
              <div className="flex flex-col items-start">
                <span className=" font-ganeta2  font-bold text-[40px]">
                  {item.profile}
                </span>
                <span className=" font-Marcellus text-[25px]">{item.organizationName}</span>
                <span className=" font-Marcellus capitalize text-[15px]">{item.location}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default Experience;
