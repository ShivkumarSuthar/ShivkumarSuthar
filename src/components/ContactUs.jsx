import React, { useState } from "react";
import emailjs from "emailjs-com";
function ContactUs() {
  const [name, setName] = useState("");
  const [Email, setEmail] = useState("");
  const [pInfo, setpInfo] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();
    emailjs
      .sendForm("service_tvvj2qk", "template_dsunklw", e.target={Email})
      .then(
        (result) => {
          console.log("Email sent successfully:", result.text);
          // Add your success message or redirect here
        },
        (error) => {
          console.error("Error sending email:", error.text);
          // Add error handling here
        }
      );
  };
  return (
    <section className="h-screen bg-black flex justify-center">
      <div className="w-[80%]">
        <h1 className="text-[55px] text-white font-wes pl-[5%] pt-[5%]">
          Let's build
          <span className=" font-black text-red-900"> greatest </span>
          <span className="text-[55px]">Projects Together.</span>
        </h1>
        <div className="pl-[5%] flex w-100">
          <div className="w-[30%]">
            <address className="text-white">shiv.str21@gmail.com </address>
            <address className="text-white">+91 6377290604</address>
            <address className="text-white">
              Jaipur (Rajasthan) or <br /> mumbai (Maharashtra)
              <br /> India{" "}
            </address>
          </div>
          <div>
            <div className="text-white">
              <p className="  text-[20px]">
                We're here to bring your concept to life, manage your ongoing
                project or expand existing developement team.{" "}
              </p>
            </div>
            <div>
              <form onSubmit={handleFormSubmit}>
                <fieldset className="border-none bg-transparent">
                  <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    id="name"
                    value={name}
                    placeholder="Name*"
                    className=" bg-transparent w-[30%] h-[50px] border-b-[1px] border-white"
                  />
                  <input
                    type="text"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    placeholder="Email*"
                    className=" bg-transparent w-[30%] h-[50px] border-b-[1px] border-white ml-[100px]"
                  />
                </fieldset>

                <fieldset>
                  <textarea
                    placeholder="Project Information*"
                    className=" bg-transparent w-[70%] h-[50px] border-b-[1px] border-white mt-[5%] min-h-[100px] max-h-[200px]"
                    value={pInfo}
                    onChange={(e) => setpInfo(e.target.value)}
                  ></textarea>
                </fieldset>
                <button
                  type="submit"
                  className="w-[15%] text-white bg-red-900 h-[50px] mt-[2%] rounded-full"
                >
                  Send Now
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ContactUs;
