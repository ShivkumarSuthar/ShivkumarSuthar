import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import dataList from '@/public/assets/dataList';

function TimelineItem({ item, index }) {
  if (!item || !item.title || !item.intro) {
    return null;
  }

  if (index % 2 === 1) {
    return (
      <section className="timeline-section scroll-section" id={`timeline${index}`}>
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
      <section className="timeline-even-section scroll-section" id={`timeline${index}`}>
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

function ScrollSection() {
  const sectionRef = useRef(null);
  const triggerRef = useRef(null);

  gsap.registerPlugin(ScrollTrigger);

  useEffect(() => {
    const pin = gsap.fromTo(
      sectionRef.current,
      {
        translateX: 0,
      },
      {
        translateX: "-300vw",
        ease: "none",
        duration: 1,
        scrollTrigger: {
          trigger: triggerRef.current,
          start: "top top",
          end: "2000 top",
          scrub: 0.6,
          pin: true,
        },
      }
    );
    return () => {
      {/* A return function for killing the animation on component unmount */ }
      pin.kill();
    };
  }, []);

  return (
    <section className="scroll-section-outer timeline-container">
     {/* <div className="timeline-header">
        <h1 className="timeline-header-text">My Work</h1>
      </div> */}
      <div ref={triggerRef} className="timeline-sections-wrapper" style={{ display: 'flex' }}>
        {dataList?.projects?.map((item, index) => (
          <div ref={sectionRef} className="scroll-section-inner"
            key={index}
            style={{ minWidth: '100vw', minHeight: '100vh' }}
          >
            <TimelineItem item={item} index={index} />
          </div>
        ))}
      </div>

      {/* <div ref={triggerRef}>
        <div ref={sectionRef} className="scroll-section-inner">
          <div className="scroll-section">
            <h3>Section 1</h3>
          </div>
          <div className="scroll-section">
            <h3>Section 2</h3>
          </div>
          <div className="scroll-section">
            <h3>Section 3</h3>
          </div>
          <div className="scroll-section">
            <h3>Section 4</h3>
          </div>
        </div>
      </div> */}
    </section>
  );
}

export default ScrollSection;