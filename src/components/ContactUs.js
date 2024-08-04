import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";

function ContactUs({className, id}) {
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [pInfo, setpInfo] = useState("");

  const form = useRef();
  const validateEmail = (email) => {
    // Email validation regex
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    if (!validateEmail(Email)) {
      alert("Please enter a valid email address.");
      return;
    }
    emailjs
      .sendForm("service_tvvj2qk", "template_rghfcrg", form.current, {
        publicKey: "oCq8YzWrgo23dHtJq",
      })
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };

  return (
    <section className={"contactSection "+className} id={id}>
      <div className="container">
        <h1 className="header">
          Let's build
          <span className="highlight"> greatest </span>
          <br />
          <span className="subHeader">Projects Together.</span>
        </h1>
        <div className="contactInfo">
          <div className="contactDetails">
            <address>shiv.str21@gmail.com</address>
            <address>+91 6377290604</address>
            <address className="address">
              Jaipur (Rajasthan) or <br /> Mumbai (Maharashtra) <br /> India
            </address>
          </div>
          <div className="message">
            <p className="messageText">
              I'm here to bring your concept to life, <br /> manage your
              ongoing project or expand <br /> existing development team.
            </p>
            <form ref={form} onSubmit={sendEmail} className="form">
              <fieldset>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  value={name}
                  name="from_name"
                  placeholder="Name*"
                />
                <input
                  type="email"
                  value={Email}
                  name="from_email"
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="Email*"
                  className="email"
                />
              </fieldset>

              <fieldset>
                <textarea
                  name="message"
                  placeholder="Project Information*"
                  value={pInfo}
                  onChange={(e) => setpInfo(e.target.value)}
                ></textarea>
              </fieldset>
              <button
                type="submit"
                className="submitButton"
              >
                Send Now
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
