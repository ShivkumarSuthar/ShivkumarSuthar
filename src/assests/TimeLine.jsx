// import degree from './images/timeline/education (1).png'
// import hardwork from './images/timeline/hard-work.png'
import work from "./images/timeline/working.png";
import school from "./images/timeline/backpack.png";
import edu from "./images/timeline/education.png";
import service from "./images/timeline/service.png";

import "./css/timeline/road.css";
import React from "react";

function TimeLine() {
    return (
        <div class="Tdata">
            <div class="timeline">
                {/* <!-- first --> */}
                <div class="timeline-item item1">
                    <div class="top left">
                        <h3 class="timeline-tittle">Content Developer</h3>
                        <div class="timeline-details">
                            <h4 class="timeline-no">03</h4>
                            <div class="timeline-data">
                                <p class="text">
                                    Join Viseven as content developer in 2022. it's a bio pharma
                                    marketing company
                                </p>
                                <h4 class="timeline-date">2017</h4>
                            </div>
                        </div>
                    </div>
                    <div className="center">
                        <span class="icon">
                            <img className="hardwork" src={service} alt="hardwork" />
                        </span>
                    </div>
                    <div class="bottom right">
                        <img src={work} class="profile" alt="profile" />
                    </div>
                </div>

                {/* <!-- even 1 --> */}
                <div class="timeline-item item2">
                    <div class="top left">
                        <span class="icon">
                            <img className="profile" src={edu} alt="profile" />
                        </span>
                    </div>
                    <div class="center">
                        <div className="icon">
                            <img src={service} class="hardwork" alt="hardwork" />
                        </div>
                    </div>
                    <div class="bottom right">
                        <div class="timeline-details">
                            <h4 class="timeline-no">02</h4>
                            <div class="timeline-data">
                                <h4 class="timeline-date">2017</h4>
                                <p class="text">This means: When you set the width/height of</p>
                            </div>
                        </div>
                        <h3 class="timeline-tittle">Research</h3>
                    </div>
                </div>
                {/* <!-- even 1 --> */}
                <div class="timeline-item item3">
                    <div class="top left">
                        <h3 class="timeline-tittle">Research</h3>
                        <div class="timeline-details">
                            <h4 class="timeline-no">01</h4>
                            <div class="timeline-data">
                                <p class="text">
                                    This means: When you set the width/height of an element, the
                                    element often appears bigger than you have set
                                </p>
                                <h4 class="timeline-date">2017</h4>
                            </div>
                        </div>
                    </div>
                    <div className="center">
                        <span class="icon">
                            <img className="hardwork" src={service} alt="hardwork" />
                        </span>
                    </div>
                    <div class="bottom right">

                        <img src={school} class="profile" alt="profile" />

                    </div>
                </div>

                {/* <!-- odd --> */}

                {/* <div class="timeline-item">
                    <div class="top">
                        <h3 class="timeline-tittle">Research</h3>
                        <div class="timeline-details">
                            <h4 class="timeline-no">01</h4>
                            <div class="timeline-data">
                                <p class="text">
                                    This means: When you set the width/height of an element, the
                                    element often appears bigger than you have set
                                </p>
                                <h4 class="timeline-date">2019</h4>
                            </div>
                        </div>
                    </div>
                    <div class="bottom">
                        <span class="icon"><i class="fa-solid fa-briefcase"></i></span>
                        <div class="b-data">
                            <img src={about} class="profile" alt='profile' />
                        </div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}

export default TimeLine;
