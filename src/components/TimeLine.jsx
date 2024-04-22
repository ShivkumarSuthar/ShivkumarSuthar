import React from "react";
import imgs from "../assets/images/texture2.jpg";
import arrow from "../assets/images/arrow.png";

function TimelineItem({ item, index }) {
  if (!item || !item.title || !item.intro) {
    return null; // Render nothing if item, title, or intro is missing
  }

  if (index % 2 === 1) {
    return (
      <section className="w-100 h-screen  flex flex-row  px-[5%] relative">
        <div className="w-[45%]  flex">
          <div className="w-[31%]">
            <span className=" text-[950px] text-yellow-700 font-ganeta2 font-black leading-[80%] absolute pl-[15%] pt-[2%]">
              {index + 1}
            </span>
          </div>
          <div className="text-white  w-[50%] relative top-[35%] opacity-65">
            <div className="pb-3">
              <div className="flex pb-10 ml-[-20px]">
                <p className="font-black text-[12px] tracking-widest transform -rotate-90 pt-3 font-hertical">
                  intro
                </p>
                <span className="transform -rotate-90 font-bold font-frosty ">
                  0{index + 1}
                </span>
              </div>
            </div>
            <div>
              <span className=" text-[16px] font-hertical">{item.intro.title}</span>
              <p className="text-[20px] font-Ganeta">{item.intro.description}</p>
            </div>
            <div className="pt-[40%]">
              <p className="text-[10px] font-black tracking-[2px] pb-2 font-hertical">
                scroll through more projects
              </p>
              <span className="text-[50px]">
                <img
                  src={arrow}
                  alt="arrow"
                  className=" h-[100%] w-[10%] transform rotate-180 ml-[-15px]"
                />
              </span>
            </div>
          </div>
        </div>
        <div className=" w-[55%] pt-20">
          <div>
            <h1 className=" font-hertical text-white text-[160px] uppercase pl-[19%]">
              {item.title.first}
            </h1>
          </div>
          <div className="flex mt-[-60px]">
            <h1 className=" font-hertical text-white text-[170px] uppercase absolute z-0 mt-[-65px] pl-[40px]">
              {item.title.second}
            </h1>
            <div className=" w-[690px] absolute z-30 right-[15%] h-[420px] opacity-70 rounded-xl border-[1px] border-orange-400 top-[43%] bg-orange-700">
              <iframe src="" frameborder="0" title="second project"></iframe>
            </div>
          
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="h-screen flex flex-row px-[5%] relative">
        <div className=" w-[55%] mt-[50px]">
          <div>
            <h1 className=" font-hertical  text-white text-[170px] uppercase pl-[125px]">
              {item.title.first}
            </h1>
          </div>
          <div className="flex mt-[-50px]">
            <h1 className=" font-hertical text-white text-[150px] uppercase absolute z-0 mt-[-65px] pl-[40px]">
              {item.title.second}
            </h1>

            <div className=" w-[720px] absolute z-30 left-[260px] h-[450px] opacity-[90%] rounded-xl border-[1px] border-orange-400 top-[28%] bg-orange-200">
              <iframe
                src=""
                frameborder="0"
                title="first Project"
                className="w-full h-full "
              ></iframe>
            </div>
          </div>
        </div>
        <div className="w-[45%]  flex ">
          <div className="mt-[-70px] w-[31%]">
            <span className=" text-[1050px] text-yellow-800  font-ganeta2 font-black leading-[80%] absolute">
              {index + 1}
            </span>
          </div>
          <div className="text-white  w-[50%] relative top-[39%] opacity-65">
            <div>
              <div className="flex pb-10 ml-[-20px] ">
                <p className="font-black text-[12px] tracking-widest transform -rotate-90 pt-3 font-hertical">
                  intro
                </p>
                <span className="transform -rotate-90 font-bold font-frosty">
                  0{index + 1}
                </span>
              </div>
              <span className=" text-[16px] font-hertical">
                {item.intro.title}
              </span>
            </div>
            <div>
              <p className="text-[18px] font-Marcellus">
                {item.intro.description}
              </p>
            </div>
            <div className="pt-[35%]">
              <p className="text-[10px] font-hertical font-black tracking-widest pb-2">
                scroll through more work
              </p>
              <span className="text-[50px]">
                <img
                  src={arrow}
                  alt="arrow"
                  className=" h-[100%] w-[10%] transform rotate-180 ml-[-15px]"
                />
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function Timeline() {
  const data = [
    {
      title: {
        first: "world",
        second: "class",
      },
      intro: {
        title: "we are",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, blanditiis eligendi. Doloremque qui, perferendis ducimus culpa voluptates, porro aliquam, rerum impedit reiciendis sint hic eos!",
      },
    },
    {
      title: {
        first: "world",
        second: "class",
      },
      intro: {
        title: "we are",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, blanditiis eligendi. Doloremque qui, perferendis ducimus culpa voluptates, porro aliquam, rerum impedit reiciendis sint hic eos!",
      },
    },
    {
      title: {
        first: "world",
        second: "class",
      },
      intro: {
        title: "we are",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, blanditiis eligendi. Doloremque qui, perferendis ducimus culpa voluptates, porro aliquam, rerum impedit reiciendis sint hic eos!",
      },
    },
 
  ];

  return (
    <section className="w-100  h-full min-h-screen  bg-black py-[2%]">
      <div className=" flex  justify-center  h-full absolute px-[15%]">
        <h1 className=" font-hertical uppercase text-[15px] tracking-[10px] text-white">
          My Work
        </h1>
      </div>

      {data.map((item, index) => (
        <TimelineItem key={index} item={item} index={index} />
      ))}
    </section>
  );
}

export default Timeline;
