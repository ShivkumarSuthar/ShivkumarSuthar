import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dataList from './dataList.json';

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
                <img
                  src={dataList?.images?.texture}
                  alt="arrow"
                  className="timeline-scroll-arrow-image"
                />
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
                <img
                  src={dataList?.images?.texture}
                  alt="arrow"
                  className="timeline-scroll-arrow-image"
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
  const containerRef = useRef(null);
  const sectionRefs = useRef([]);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   const sections = sectionRefs.current;

  //   // Set up the horizontal scroll
  //   gsap.to(sections, {
  //     xPercent: -100 * (sections.length - 1),
  //     ease: "none",
  //     scrollTrigger: {
  //       trigger: container,
  //       pin: true,
  //       scrub: 1,
  //       snap: 1 / (sections.length - 1),
  //       end: () => "+=" + container.offsetWidth * (sections.length - 1)
  //     }
  //   });

  //   // Animate each section
  //   sections.forEach((section, index) => {
  //     gsap.fromTo(section.querySelector('.timeline-intro-content, .timeline-even-intro-content'),
  //       { opacity: 0, x: -50 },
  //       {
  //         opacity: 1,
  //         x: 0,
  //         duration: 1,
  //         scrollTrigger: {
  //           trigger: section,
  //           containerAnimation: ScrollTrigger.getById("mainScroll"),
  //           start: "left center",
  //           toggleActions: "play none none reverse"
  //         }
  //       }
  //     );

  //     // Animate project frame
  //     gsap.fromTo(section.querySelector('.timeline-project-frame, .timeline-even-project-frame'),
  //       { opacity: 0, scale: 0.8 },
  //       {
  //         opacity: 1,
  //         scale: 1,
  //         duration: 1,
  //         scrollTrigger: {
  //           trigger: section,
  //           containerAnimation: ScrollTrigger.getById("mainScroll"),
  //           start: "left center",
  //           toggleActions: "play none none reverse"
  //         }
  //       }
  //     );
  //   });

  // }, []);

  return (
    <section className="timeline-container" ref={containerRef}>
      <div className="timeline-header">
        <h1 className="timeline-header-text">My Work</h1>
      </div>
      <div className="timeline-sections-wrapper" style={{ display: 'flex' }}>
        {dataList?.projects?.map((item, index) => (
          <div 
            key={index} 
            ref={el => sectionRefs.current[index] = el}
            style={{ minWidth: '100vw', minHeight: '100vh' }}
          >
            <TimelineItem item={item} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Timeline;