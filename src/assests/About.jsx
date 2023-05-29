
import { Col, Container, Row } from "react-bootstrap";
import Header from "./Header";
import TextSphere from "./TextSphere";
import htmlImg from "../assests/images/html-5.png";
import cssImg from "../assests/images/css-3.png";
import jsImg from "../assests/images/javascript.png";
import bootstrap from "../assests/images/bootstrap.png";
import tailwind from "../assests/images/tailwind-css-icon.png";
import react from "../assests/images/react.png";
import sass from "../assests/images/sass.png";
import github from "../assests/images/pngwing.com.png";
import git from "../assests/images/pngwing.com (1).png";
import vue from "../assests/images/vue-js-icon.png";
import resume from "./resume.pdf";
import TimeLine from "./TimeLine";

function About() {
  return (
    <Container fluid className="about">
      {/* this is video  */}

      <Header />

      <Row className="tcontent">
        <h3 className="tittle">
          About <span className="color">Me</span>
        </h3>
        <h5 className="subTittle">
          get to know <span className="color">me....</span>
        </h5>
      </Row>
      <Row className="bcontent">
        <Col className="labout">
          <h3 className="intro">
            I'm creative <span className="color">Web Developer</span> based in
            Jaipur, India.
          </h3>
          <h4 className="dIntro">
            With 2 years of experience as a professional Web developer, I have
            acquired the skills and knowledge necessary to make your project a
            success. I enjoy every step while working.
          </h4>
          <div className="resumebtn">
            <a href={resume} download="resume" className="resume-btn">
              Download Resume
            </a>
          </div>
        </Col>
        <Col className="rabout" lg={6}>
          <TextSphere />
        </Col>
      </Row>
      <Row className="timeline2">
        <h3 className="tittle">Milestones and Achievements</h3>
        <Col className="data">
          {/* <TimeLine /> */}
        </Col>
      </Row>
      <Row className="skills">
        <h3 className="tittle">
          What I Can <span className="color">Do</span>
        </h3>
        <h5 className="subtittle">areas of mastery....</h5>
        <Col className="col2">
          <div className="lskill">
            <h3 className="sTittle">skills</h3>
          </div>
          <div className="rskill" lg={10}>
            <Row className="data">
              <Col className="skill htmlSkill" lg={1}>
                <img src={htmlImg} className="skillImg" alt="html" />
              </Col>
              <Col className="skill cssSkill" lg={1}>
                <img src={cssImg} className="skillImg" alt="css" />
              </Col>
              <Col className="skill js" lg={1}>
                <img src={jsImg} className="skillImg" alt="js" />
              </Col>
              <Col className="skill react" lg={1}>
                <img src={react} className="skillImg" alt="react" />
              </Col>
              <Col className="skill vue" lg={1}>
                <img src={vue} className="skillImg" alt="vue" />
              </Col>
              <Col className="skill bootstrap" lg={1}>
                <img src={bootstrap} className="skillImg" alt="bootstrap" />
              </Col>
              <Col className="skill tailwind" lg={1}>
                <img src={tailwind} className="skillImg" alt="tailwind" />
              </Col>
              <Col className="skill sass" lg={1}>
                <img src={sass} className="skillImg" alt="sass" />
              </Col>
              <Col className="skill github" lg={1}>
                <img src={github} className="skillImg" alt="github" />
              </Col>
              <Col className="skill git" lg={1}>
                <img src={git} className="skillImg" alt="git" />
              </Col>
              <Col className="skill github" lg={1}>
                <img src={github} className="skillImg" alt="github" />
              </Col>
              <Col className="skill git" lg={1}>
                <img src={git} className="skillImg" alt="git" />
              </Col>
            </Row>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default About;
