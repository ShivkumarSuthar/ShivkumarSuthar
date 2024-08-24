'use client'
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dataList from '@/public/assets/dataList';

gsap.registerPlugin(ScrollTrigger);

function TimelineItem({ item, index }) {
  if (!item || !item.title || !item.intro) {
    return null;
  }

  if (index % 2 === 1) {
    return (
      <section className="timeline-section" id={`timeline${index}`}>
        <div className="timeline-left-content">
          <div className="timeline-number-container">
            <span className="timeline-large-number">
              {index + 1}
            </span>
          </div>
          <div className="timeline-intro-content">
            <div className="timeline-intro-header">
              <div className="timeline-intro-label">
                <p className="timeline-intro-text">
                  intro
                </p>
                <span className="timeline-intro-number">
                  0{index + 1}
                </span>
              </div>
            </div>
            <div>
              <span className="timeline-intro-title">{item.intro.title}</span>
              <p className="timeline-intro-description">{item.intro.description}</p>
            </div>
            <div className="timeline-scroll-hint">
              <p className="timeline-scroll-text">
                scroll through more projects
              </p>
              <span className="timeline-scroll-arrow">
                {/* <img
                  src={dataList?.images?.texture}
                  alt="arrow"
                  className="timeline-scroll-arrow-image"
                /> */}
              </span>
            </div>
          </div>
        </div>
        <div className="timeline-right-content">
          <div>
            <h1 className="timeline-title-first">
              {item.title.first}
            </h1>
          </div>
          <div className="flex mt-[-60px]">
            <h1 className="timeline-title-second">
              {item.title.second}
            </h1>
            <div className="timeline-project-frame">
              <iframe
                src={item?.iframe_src}
                frameBorder="0"
                title={item.title}
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>
    );
  } else {
    return (
      <section className="timeline-even-section" id={`timeline${index}`}>
        <div className="timeline-even-left-content">
          <div>
            <h1 className="timeline-even-title-first">
              {item.title.first}
            </h1>
          </div>
          <div className="flex mt-[-50px]">
            <h1 className="timeline-even-title-second">
              {item.title.second}
            </h1>
            <div className="timeline-even-project-frame">
              <iframe
                src={item?.iframe_src}
                frameBorder="0"
                title={item.title}
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        </div>
        <div className="timeline-even-right-content">
          <div className="timeline-even-number-container">
            <span className="timeline-even-large-number">
              {index + 1}
            </span>
          </div>
          <div className="timeline-even-intro-content">
            <div>
              <div className="timeline-intro-label">
                <p className="timeline-intro-text">
                  intro
                </p>
                <span className="timeline-intro-number">
                  0{index + 1}
                </span>
              </div>
              <span className="timeline-intro-title">
                {item.intro.title}
              </span>
            </div>
            <div>
              <p className="timeline-even-intro-description">
                {item.intro.description}
              </p>
            </div>
            <div className="timeline-scroll-hint">
              <p className="timeline-scroll-text">
                scroll through more work
              </p>
              <span className="timeline-scroll-arrow">
                {/* <img
                  src={dataList?.images?.texture}
                  alt="arrow"
                  className="timeline-scroll-arrow-image"
                /> */}
              </span>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

function ProjectTimeLine() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      {
        translateX: 0,
      },
      {
        translateX: `-${(dataList?.projects?.length - 1) * 100}vw`,
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current || "300vh",
          start: "top",
          end: () => `+=${(dataList?.projects?.length - 1) * window.innerWidth}`,
          scrub: 0.6,
          pin: true,
        },
      }
    );

    return () => {
      pin.kill();
    };
  }, []);

  return (
    <>
   
    <section className="timeline-container scroll-section-outer" ref={triggerRef}>
    <div className="timeline-header">
            <h1 className="timeline-header-text">My Work</h1>
          </div>
      <div className="timeline-sections-wrapper scroll-section-inner" ref={sectionRef} style={{ display: 'flex' }}>
        {dataList?.projects?.map((item, index) => (
          <div className='scroll-section' 
            key={index}
            style={{ minWidth: '100vw', minHeight: '100vh' }}
          >
            <TimelineItem item={item} index={index} />
          </div>
        ))}
      </div>
    </section>
    </>
  );
}

export default ProjectTimeLine;