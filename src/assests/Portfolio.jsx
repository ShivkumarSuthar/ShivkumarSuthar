import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Header from "./Header";
import clinic from "./images/doc.png";

function Portfolio() {
  return (
    <div className="mywork">
      <Header />
      <Container fluid className="work">
        <h3 className="tittle">
          My <span className="color">Portfolio</span>
        </h3>
        <h5 className="subHeading">some of my awesome work....</h5>
        <Row className="content">
          {/* first image */}
          <Col className="wimg img1">
            <img src={clinic} alt="project" />
            <div className="red">
              <div className="red2">
                <span className="text">
                  View
                  <br /> Project
                </span>
              </div>
            </div>
          </Col>

          {/* secong image */}
          <Col className="wimg img2">
            <img src={clinic} alt="project" />
            <div className="red">
              <div className="red2">
                <span className="text">
                  View
                  <br /> Project
                </span>
              </div>
            </div>
          </Col>
          {/* third image */}
          <Col className="wimg img3 ">
            <img src={clinic} alt="project" />
            <div className="red">
              <div className="red2">
                <span className="text">
                  View
                  <br /> Project
                </span>
              </div>
            </div>
          </Col>
          {/* fourth image */}
          <Col className="wimg img4">
            <img src={clinic} alt="project" />
            <div className="red">
              <div className="red2">
                <span className="text">
                  View
                  <br /> Project
                </span>
              </div>
            </div>
          </Col>
          {/* fifth image */}
          <Col className="wimg img5">
            <img src={clinic} alt="project" />
            <div className="red">
              <div className="red2">
                <span className="text">
                  View
                  <br /> Project
                </span>
              </div>
            </div>
          </Col>
          {/* sixth image */}
          <Col className="wimg img6">
            <img src={clinic} alt="project" />
            <div className="red">
              <div className="red2">
                <span className="text">
                  View
                  <br /> Project
                </span>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default Portfolio;
