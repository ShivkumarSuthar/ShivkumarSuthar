import React, { useRef, useState } from 'react'
import emailjs from "@emailjs/browser";
import { MdCall, MdOutlineAddIcCall, MdOutlineFileUpload } from "react-icons/md";
import { FaLocationArrow, FaLongArrowAltRight } from "react-icons/fa";
import dataList from "./dataList.json"
import { TbSquareRoundedArrowRight } from 'react-icons/tb';
import { CiLocationArrow1 } from 'react-icons/ci';
import { FaArrowRightLong } from 'react-icons/fa6';
import { IoArrowRedoSharp } from 'react-icons/io5';
import { SiMaildotru } from 'react-icons/si';
function Contact({ clasName, id }) {
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [pInfo, setpInfo] = useState("");

  const form = useRef();
  const fileUpload = useRef()
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
    <>
    <section className={"contact-page " + clasName} id={id}>
      <div className='contact-wrapper'>
        <div className='left-wrapper'>
          {/* <img src={dataList?.images?.telephone} alt='telephone'/> */}
          <div className='text-contact'>
            <h1 className='contact-heading'>Contact Us</h1>
            <span className='contact-title'>Have a Projects?</span>
          </div>
        </div>
        <div className='right-wrapper'>
          <div className='contact-form-page'>
            <form ref={form} onSubmit={sendEmail} className="contact-form">
              <div>
                <label className="what-label">What can I do for you?</label>
                <fieldset className='button-field'>
                  <input type='text' value="App Design" />
                  <input type='text' value="Web Design" />
                  <input type='text' value="Development" />
                  <input type='text' value="other" />
                </fieldset>
              </div>

              <fieldset>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  value={name}
                  name="from_name"
                  placeholder="Name"
                  className='input'
                />
              </fieldset>
              <fieldset>
                <input
                  type="text"
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  value={name}
                  name="from_name"
                  placeholder="phone"
                  className='input'
                />
              </fieldset>
              <fieldset>
                <input
                  type="email"
                  value={Email}
                  name="from_email"
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  placeholder="Email"
                  className="email input"
                />
              </fieldset>


              <textarea
                name="message"
                className='message'
                placeholder="Project Information*"
                value={pInfo}
                onChange={(e) => setpInfo(e.target.value)}
              ></textarea>
              <div className='button-div'>
                {/* <input type='file' ref={fileUpload} className='file-button' />
                <label className='file-label'><MdOutlineFileUpload className='file-icon' />Upload file</label> */}
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
        <div className='contact-details'>
          <address>Vaisali Nagar, Jaipur <br/> Rajasthan(302034)</address>
        </div>
        <div className='contact-details'>
          <span><MdCall className='icon'/><a href="mailto:shiv.str21@gmail.com">shiv.str21@gmail.com</a></span>
          <span><SiMaildotru className='icon'/><a href='tel(+91 6377290604)'>+91 6377290604</a> </span>
        </div>
    </div>
    </>
  )
}

export default Contact