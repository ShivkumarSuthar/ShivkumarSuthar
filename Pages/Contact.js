'use client'
import React, { useRef, useState } from 'react';
import emailjs from 'emailjs-com';
import { MdCall } from 'react-icons/md';
import { IoArrowRedoSharp } from 'react-icons/io5';
import { SiMaildotru } from 'react-icons/si';

const Contact = ({ clasName, id }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [pInfo, setPInfo] = useState("");
  const [selectedService, setSelectedService] = useState("");

  const form = useRef();

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const sendEmail = (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }
    emailjs.sendForm('service_tvvj2qk', 'template_rghfcrg', form.current, process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY)
      .then(
        () => {
          console.log("SUCCESS!");
        },
        (error) => {
          console.log("FAILED...", error);
        }
      );
  };
  console.log(">>>sele", selectedService)

  return (
    <>
      <section className={`contact-page ${clasName}`} id={id}>
        <div className='contact-wrapper'>
          <div className='left-wrapper'>
            {/* <img src="/images/telephone.png" alt='telephone'/> */}
            <div className='text-contact'>
              <h1 className='contact-heading'>Contact Me</h1>
              <span className='contact-title'>Have a Project?</span>
            </div>
          </div>
          <div className='right-wrapper'>
            <div className='contact-form-page'>
              <form ref={form} onSubmit={sendEmail} className="contact-form">
                <div>
                  <label className="what-label">What can I do for you?</label>
                  <fieldset className='button-field'>
                    <button
                      type='button'
                      className={`service-button-${selectedService === "frontend" ? "selected" : ""}`}
                      onClick={() => setSelectedService("frontend")}
                    >
                      Frontend
                    </button>
                    <button
                      type='button'
                      className={`service-button-${selectedService === "backend" ? "selected" : ""}`}
                      onClick={() => setSelectedService("backend")}
                    >
                      Backend
                    </button>
                    <button
                      type='button'
                      className={`service-button-${selectedService === "web" ? "selected" : ""}`}
                      onClick={() => setSelectedService("web")}
                    >
                      Web Development
                    </button>
                    <button
                      type='button'
                      className={`service-button-${selectedService === "others" ? "selected" : ""}`}
                      onClick={() => setSelectedService("others")}
                      onDoubleClick={() => setSelectedService("")}
                    >
                      Others
                    </button>
                  </fieldset>
                </div>
                <fieldset>
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                    name="from_name"
                    placeholder="Name*"
                    className='input'
                  />
                </fieldset>
                <fieldset>
                  <input
                    type="text"
                    onChange={(e) => setPhoneNo(e.target.value)}
                    value={phoneNo}
                    name="from_phone"
                    placeholder="Phone*"
                    className='input'
                  />
                </fieldset>
                <fieldset>
                  <input
                    type="email"
                    value={email}
                    name="from_email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email*"
                    className="email input"
                  />
                </fieldset>
                <textarea
                  name="message"
                  className='message'
                  placeholder="Project Information*"
                  value={pInfo}
                  onChange={(e) => setPInfo(e.target.value)}
                ></textarea>
                <div className='button-div'>
                  <button
                    type="submit"
                    className="submitButton"
                  >
                    Send message <IoArrowRedoSharp className='submit-icon' />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
      <div className='contact-bottom-wrapper'>
        <div className='contact-bottom-content'>
          <div className='contact-details'>
            <address>Vaisali Nagar, Jaipur <br /> Rajasthan(302034)</address>
          </div>
          <div className='contact-details'>
            <span><MdCall className='icon' /><a href="mailto:shiv.str21@gmail.com">shiv.str21@gmail.com</a></span>
            <span><SiMaildotru className='icon' /><a href='tel:+916377290604'>+91 6377290604</a> </span>
          </div>
        </div>
        <div className='author'>developed by Shivkumar Suthar from bottom of his heart ❤️</div>
      </div>
    </>
  );
}

export default Contact;
