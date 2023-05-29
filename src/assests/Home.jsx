
import { Col, Container, Row } from "react-bootstrap";
import Header from "./Header";
import Typewriter from "typewriter-effect";
import video from "../assests/images/pexels-pressmaster-3141208-3840x2160-25fps.mp4";
import Footer from "./Footer";

function Home() {
  const options = {
    strings: [
      '<span className="fText">I\'m a Web Developer..</p > ',
      "Eat 😋",
      "Sleep 😪",
      "Code 💻",
      "Repeat 🔁",
    ],
    autoStart: true,
    loop: true,
    delaySpeed: 1000,
  };

  return (
    <>
      <section className="home">
        <Container fluid>
          {/* <video className="videoTag" autoPlay loop muted>
            <source src={video} />
          </video> */}
          <Header />

          <Row className="hdata">
            <Col md={1} className="social">

              <a href="https://github.com/ShivkumarSuthar">
                {" "}
                <i className="fa-brands fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/shivkumar-suthar/">
                {" "}
                <i className="fa-brands fa-linkedin"></i>
              </a>
              <a href="https://www.youtube.com/channel/UCYOLHEA69vDfy0EpPbRBLlQ">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://www.behance.net/shivkumarsuthar">
                {" "}
                <i className="fa-brands fa-behance"></i>
              </a>

            </Col>
            <Col className="main">
              <h1 className="name">
                <div className="hi">
                  <button className="c">H</button>
                  <button className="c">I,</button>
                </div>
                <div className="firstName">
                  <div className="first">
                    <button className="c c1">S</button>
                    <button className="c c2">H</button>
                    <button className="c c3">I</button>
                    <button className="c c4">V</button>
                    <button className="c c5">K</button>
                    <button className="c c6">U</button>
                    <button className="c c7">M</button>
                    <button className="c c8">A</button>
                    <button className="c c9">R</button>
                  </div>
                  &nbsp;
                  <div className="last">
                    <button className="c c1">S</button>
                    <button className="c c2">u</button>
                    <button className="c c3">t</button>
                    <button className="c c4">h</button>
                    <button className="c c5">a</button>
                    <button className="c c6">r</button>
                  </div>
                </div>
              </h1>
              <p className="meratext">
                &nbsp;
                <Typewriter options={options} />
              </p>
            </Col>
            <Col md={1} className="social s-2">

              <a href="mailto:shiv.str21@gmail.com">
                <i className="fa-solid fa-paper-plane"></i>
              </a>
              <a href="tel:+916377290604">
                <i className="fa-solid fa-phone"></i>{" "}
              </a>

            </Col>
          </Row>

          {/* <Footer /> */}
        </Container>
      </section>
    </>
  );
}

export default Home;
