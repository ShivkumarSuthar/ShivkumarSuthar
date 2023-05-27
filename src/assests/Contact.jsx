import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Header from "./Header";

function Contact() {
    var name = document.getElementById("name");
    var email = document.getElementById("email");
    var sub = document.getElementById('sub');
    var text = document.getElementById('text');
    var sendMail = document.getElementById('sendMail');

    function sendMails() {
        name.value = 'shiv';
    }

    return (
        <Container fluid className="contact">
            <Header />
            <Row className="content">
                <Col className="left">
                    <div className="content">
                        <h3 className="tittle">Contact Me</h3>
                        <h5 className="text">I’m interested in freelance opportunities – especially ambitious for large projects. However, if you have other request or question, don’t hesitate to use the form.</h5>
                        <form>
                            <input className="name" type="text" placeholder="name......" id="name" />

                            <input className="email" type="email" placeholder="email....." id="email" />
                            <br />
                            <input className="subject" type="text" placeholder="subject....." id="sub" />
                            <br />

                            <textarea className="textarea" placeholder="message......" id="text"></textarea>
                            <br />
                            <button type="submit" className="submit" id="sendMail" onClick={sendMails}>send message</button>
                            {/* <i class="fa-solid fa-arrow-right-long"></i> */}
                        </form>
                    </div>
                </Col>

                <Col className="right">
                    <iframe title="map" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d227749.05321012135!2d75.62574633590978!3d26.8851151450147!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396c4adf4c57e281%3A0xce1c63a0cf22e09!2sJaipur%2C%20Rajasthan!5e0!3m2!1sen!2sin!4v1681447181865!5m2!1sen!2sin" width="600" height="450" style={{ border: "0" }} allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
                </Col>

            </Row>
        </Container>
    );
}

export default Contact;
