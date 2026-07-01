import { useState } from "react";
import HeadingText from "../../component/Common/HeadingText/HeadingText";
import HalfInputBox from "../../component/Common/Inputboxes/HalfInputBox";
import { FaArrowRight } from "react-icons/fa";
import { sendMessage } from "../../shared/api";

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({
      submitted: false,
      submitting: true,
      info: { error: false, msg: null },
    });

    try {
      await sendMessage({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });

      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: "Thank you! Your message has been sent successfully." },
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      // If backend fails, fallback to FormSubmit.co
      try {
        const response = await fetch("https://formsubmit.co/ajax/Alrafi321@icloud.com", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: "New Message from Portfolio Website (Fallback)",
          }),
        });

        if (response.ok) {
          setStatus({
            submitted: true,
            submitting: false,
            info: { error: false, msg: "Thank you! Your message has been sent successfully (via fallback server)." },
          });
          setFormData({ name: "", email: "", message: "" });
        } else {
          const result = await response.json();
          setStatus({
            submitted: false,
            submitting: false,
            info: { error: true, msg: result.message || "Something went wrong. Please try again." },
          });
        }
      } catch (fallbackError) {
        setStatus({
          submitted: false,
          submitting: false,
          info: {
            error: true,
            msg: error.message || "Unable to connect to the server. Please try again later.",
          },
        });
      }
    }
  };

  return (
    <section className=" w-full px-5 xlg:px-28 py-20">
      <div>
        <div className="flex justify-center">
          <HeadingText
            className="text-[48px] text-primaryWhite font-semibold"
            text="Get In Touch"
          />
        </div>

        <div className="mt-20">
          <form onSubmit={handleSubmit}>
            <div className=" w-full xl:w-[900px] mx-auto p-5 xlg:p-10 border border-primaryWhite600 rounded-xl bg-transparent">
              <div className="w-full flex flex-col xlg:flex-row gap-3 items-center justify-between">
                <div className="w-full xlg:w-[49%] border-primaryWhite600 rounded-xl">
                  <HalfInputBox
                    type="text"
                    placeholder="Enter Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="w-full xlg:w-[49%] border-primaryWhite600 rounded-xl">
                  <HalfInputBox
                    type="email"
                    placeholder="Enter Your Mail"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mt-8">
                <textarea
                  className="w-full h-[300px] rounded-xl bg-transparent text-primaryWhite border border-primaryWhite600 p-5 outline-none focus:border-primaryPest transition-colors duration-300"
                  placeholder="Enter Your Message"
                  name="message"
                  id="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              {/* Status Message Display */}
              {status.info.msg && (
                <div className={`mt-6 text-center text-lg ${status.info.error ? "text-red-500" : "text-primaryPest"}`}>
                  {status.info.msg}
                </div>
              )}

              <div className="mt-10 flex justify-center">
                <button
                  type="submit"
                  disabled={status.submitting}
                  className="w-[150px] lg:w-[250px] relative text-center z-[111] py-[10px] cursor-pointer mainHover bg-transparent border-0 outline-none block"
                >
                  <span className="flex gap-2 items-center justify-center w-full text-[18px] lg:text-[22px] text-center text-primaryWhite relative z-[11111]">
                    {status.submitting ? "Sending..." : "Send Message"}{" "}
                    <FaArrowRight className="text-primaryWhite text-[20px]" />
                  </span>
                  <div className="absolute w-[15%] h-full bg-primaryPest left-0 top-0 z-10 hoverElemet"></div>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="pt-[120px] pb-[40px] flex justify-center items-center">
        <span className="text-primaryWhite text-[16px]">
          © 2024 Al Nahian Rafi.
        </span>
      </div>
    </section>
  );
};

export default GetInTouch;
