import { useState, useEffect } from "react";
import HeadingText from "../Common/HeadingText/HeadingText";
import SubHeading from "../Common/SubHeading/SubHeading";
import ForBg from "../../assets/ForBanner.png";
import Typewriter from "typewriter-effect";
import { getProfile } from "../../shared/api";

const HeadingTitle = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile in HeadingTitle:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const name = profile?.name || "Al Nahian Rafi";
  const typewriterStrings = profile?.typewriterStrings && profile.typewriterStrings.length > 0
    ? profile.typewriterStrings
    : ["Developer.", "React Developer.", "Front-End Developer."];

  return (
    <section id="home" className="w-full h-[100dvh]">
      <div className="relative w-full h-full flex flex-col justify-center items-center">
        <div className="mr-9 md:mr-48 relative">
          <div className="flex flex-col gap-5 md:gap-10 relative z-20">
            <SubHeading text={name} />
            <div className="relative">
              <HeadingText
                className="text-[28px] md:text-[38px] lg:text-[52px] xlg:text-[80px] font-extrabold leading-6 text-primaryWhite"
                text="Front-End"
              />
              <div className="absolute h-[3px] w-[60px] md:w-[100px] lg:w-[180px] xlg:w-[300px] bg-primaryWhite600 top-[51%] right-[-48%] md:right-[-65%] lg:right-[-85%]"></div>
            </div>
          </div>
        </div>

        <div className="relative z-20 mt-4 md:mt-5 lg:mt-10 xlg:mt-20 ml-12 md:ml-[-70px] lg:ml-12">
          <div className="text-[28px] md:text-[38px] lg:text-[52px] xlg:text-[80px] font-extrabold leading-6 text-primaryWhite">
            {!loading && (
              <Typewriter
                options={{
                  strings: typewriterStrings,
                  autoStart: true,
                  loop: true,
                  delay: 100,
                  deleteSpeed: 30,
                  pauseFor: 2000,
                }}
              />
            )}
          </div>
        </div>

        <div className="absolute z-10 right-0 top-0 w-[70%] h-[80dvh]">
          <img
            className="h-full w-full object-cover"
            src={ForBg}
            alt="not found"
          />
        </div>
      </div>
    </section>
  );
};

export default HeadingTitle;
