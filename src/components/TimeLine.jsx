import React from "react";
import imgs from "../assets/images/texture2.jpg";
import arrow from "../assets/images/arrow.png";

function TimelineItem({ item, index }) {
  if (!item || !item.title || !item.intro) {
    return null; // Render nothing if item, title, or intro is missing
  }
  
  if (index % 2 === 1) {
    return (
      <section className="w-100 h-screen  flex flex-row bg-black pt-[5%]">
        <div className="w-[45%]  flex">
          <div className="w-[31%]">
            <span className=" text-[800px] text-yellow-700 font-thin font-turis_B leading-[80%] absolute pl-[15%] pt-[2%]">
              {index + 1}
            </span>
          </div>
          <div className="text-white  font-athena uppercase w-[50%] relative top-[35%] opacity-65">
            <div className="pb-3">
              <div className="flex pb-4 ml-[-20px]">
                <p className="font-black text-[12px] tracking-widest transform -rotate-90 pt-3">
                  intro
                </p>
                <span className="transform -rotate-90 font-bold ">0{index + 1}</span>
              </div>
            </div>
            <div>
              <span className=" text-[16px]">{item.intro.title}</span>
              <p className="text-[15px]">
                {item.intro.description}
              </p>
            </div>
            <div className="pt-[35%]">
              <p className="text-[10px] font-black tracking-widest pb-2">
                scroll through games
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
        <div className=" w-[55%] mt-10">
          <div>
            <h1 className=" font-athena text-white text-[140px] uppercase pl-[21%]">
              {item.title.first}
            </h1>
          </div>
          <div className="flex mt-[-60px]">
            <h1 className=" font-athena text-white text-[200px] uppercase absolute z-40 mt-[-65px] pl-[40px]">
              {item.title.second}
            </h1>
            <img
              src={imgs}
              alt="imgs"
              className=" w-[600px] absolute z-30 right-[20%] h-[360px] opacity-70 rounded-xl border-[1px] border-orange-400"
            />
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="h-screen flex flex-row bg-black">
        <div className=" w-[55%] mt-[50px]">
          <div>
            <h1 className=" font-athena text-white text-[190px] uppercase pl-[129px]">
              {item.title.first}
            </h1>
          </div>
          <div className="flex mt-[-80px]">
            <h1 className=" font-athena text-white text-[170px] uppercase absolute z-40 mt-[-65px] pl-[40px]">
              {item.title.second}
            </h1>
            <img
              src={imgs}
              alt="imgs"
              className=" w-[690px] absolute z-30 left-[240px] h-[390px] opacity-70 rounded-xl border-[1px] border-orange-400"
            />
          </div>
        </div>
        <div className="w-[45%]  flex ">
          <div className="mt-[60px] w-[31%]">
            <span className=" text-[800px] text-yellow-800 font-artisual_deco font-bold leading-[80%] absolute">
              {index + 1}
            </span>
          </div>
          <div className="text-white  font-athena uppercase w-[50%] relative top-[39%] opacity-65">
            <div>
              <div className="flex pb-4 ml-[-20px]">
                <p className="font-black text-[12px] tracking-widest transform -rotate-90 pt-3">
                  intro
                </p>
                <span className="transform -rotate-90 font-bold ">0{index + 1}</span>
              </div>
              <span className=" text-[16px]">{item.intro.title}</span>
            </div>
            <div>
              <p className="text-[15px]">
                {item.intro.description}
              </p>
            </div>
            <div className="pt-[35%]">
              <p className="text-[10px] font-black tracking-widest pb-2">
                scroll through games
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
        second: "class"
      },
      intro: {
        title: "we are",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, blanditiis eligendi. Doloremque qui, perferendis ducimus culpa voluptates, porro aliquam, rerum impedit reiciendis sint hic eos!"
      }
    },
    {
      title: {
        first: "world",
        second: "class"
      },
      intro: {
        title: "we are",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, blanditiis eligendi. Doloremque qui, perferendis ducimus culpa voluptates, porro aliquam, rerum impedit reiciendis sint hic eos!"
      }
    },
    {
      title: {
        first: "world",
        second: "class"
      },
      intro: {
        title: "we are",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, blanditiis eligendi. Doloremque qui, perferendis ducimus culpa voluptates, porro aliquam, rerum impedit reiciendis sint hic eos!"
      }
    }, {
      title: {
        first: "world",
        second: "class"
      },
      intro: {
        title: "we are",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, blanditiis eligendi. Doloremque qui, perferendis ducimus culpa voluptates, porro aliquam, rerum impedit reiciendis sint hic eos!"
      }
    },
  ];

  return (
    <section className="w-100 bg-black h-full min-h-screen pb-[15%]">
      {data.map((item, index) => (
        <TimelineItem key={index} item={item} index={index} />
      ))}
    </section>
  );
}

export default Timeline;
