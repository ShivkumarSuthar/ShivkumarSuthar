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
    <section className="h-screen bg-black flex justify-center items-center">
      <div className="w-[80%]">
        <h1 className="text-[45px] text-white font-hertical pl-[5%]  leading-[90%]">
          Let's build
          <span className=" font-black text-red-700"> greatest </span>
          <br />
          <span className="text-[35px]">Projects Together.</span>
        </h1>
        <div className="pl-[5%] flex w-100 pt-[2%]">
          <div className="w-[40%] font-serif font-light">
            <address className="text-white text-[15px] pt-2">
              shiv.str21@gmail.com{" "}
            </address>
            <address className="text-white text-[15px]">+91 6377290604</address>
            <address className="text-white text-[15px] py-3">
              Jaipur (Rajasthan) or <br /> mumbai (Maharashtra)
              <br /> India{" "}
            </address>
          </div>
          <div className="w-[70%]">
            <div className="text-white">
              <p className="  text-[30px] font-Ganeta text-wrap tracking-tighter pb-[20px]">
                I'm here to bring your concept to life, <br /> manage your
                ongoing project or expand <br /> existing developement team.
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
                    className=" font-hertical bg-transparent w-[42%] h-[50px] border-b-[1px] border-white"
                  />
                  <input
                    type="text"
                    value={Email}
                    onChange={(e) => setEmail(e.target.value)}
                    id="email"
                    placeholder="Email*"
                    className=" font-hertical bg-transparent w-[42%] h-[50px] border-b-[1px] border-white ml-[100px]"
                  />
                </fieldset>

                <fieldset>
                  <textarea
                    placeholder="Project Information*"
                    className=" font-hertical bg-transparent w-[100%] h-[50px] border-b-[1px] border-white mt-[5%] min-h-[100px] max-h-[200px]"
                    value={pInfo}
                    onChange={(e) => setpInfo(e.target.value)}
                  ></textarea>
                </fieldset>
                <button
                  type="submit"
                  className="w-[20%] text-white bg-red-900 h-[50px] mt-[3%] rounded-full font-hertical text-[15px]"
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
