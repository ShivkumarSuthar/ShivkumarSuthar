import React, { useState } from "react";
import { Container, Nav, Navbar } from "react-bootstrap";
// import { Link } from 'react-router-dom';
import { BrowserRouter, Link } from "react-router-dom";

function Header() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  function handleToggle() {
    setIsFullscreen(!isFullscreen);
  }

  //menu
  // function onclickmenu() {
  //     document.getElementById("menu").classList.toggle("change");
  // }

  return (
    <Container fluid className="header">
      <Navbar
        className={isFullscreen ? "fullscreen" : ""}
        expand="false"
        sticky="top"
      >
        <Navbar.Brand className="brand">S</Navbar.Brand>
        <Navbar.Toggle
          aria-controls="myheader"
          className="toggler"
          onClick={handleToggle}
        >
          <span id="bar1" class="bar"></span>
          <span id="bar2" class="bar"></span>
          <span id="bar3" class="bar"></span>
        </Navbar.Toggle>
        <Navbar.Collapse id="myheader">
          <Nav className="navlink2">
            <Link to="/" className="link homeTown">
              Home
            </Link>
            <Link to="/about" className="link">
              About
            </Link>
            {/* <Link to="/blog" className='link'>Blog</Link> */}
            <Link to="/portfolio" className="link">
              Work
            </Link>
            <Link to="/contact" className="link">
              Contact
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Container>
  );
}

export default Header;
