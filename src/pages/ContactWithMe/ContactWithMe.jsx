import { useState, useEffect } from "react";
import HeadingText from "../../component/Common/HeadingText/HeadingText";
import { CiPhone } from "react-icons/ci";
import { MdOutlineMarkEmailUnread } from "react-icons/md";
import { FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Fade } from "react-awesome-reveal";
import { getProfile } from "../../shared/api";

const ContactWithMe = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile in ContactWithMe:", error);
      }
    };
    fetchProfile();
  }, []);

  const phone = profile?.phone || "+8801761186858";
  const email = profile?.email || "Alrafi321@icloud.com";
  const githubPersonalLink = profile?.githubPersonalLink || "https://github.com/dev-nahianrafi";
  const githubPersonalUser = profile?.githubPersonalUser || "dev-nahianrafi";
  const githubOfficialLink = profile?.githubOfficialLink || "https://github.com/dev-Nahian";
  const githubOfficialUser = profile?.githubOfficialUser || "dev-Nahian";

  return (
    <section
      id="contact"
      className=" py-[60px] xlg:py-[120px] xlg:mt-20 xl:mt-0 w-full flex flex-col justify-center items-center px-10 xlg:px-28"
    >
      <div className="flex flex-col justify-center items-center ">
        <div className="flex justify-center">
          <HeadingText
            className="text-[32px] xlg:text-[48px] text-primaryWhite font-semibold"
            text="How To Reach Me?"
          />
        </div>
        <Fade direction="up" triggerOnce duration={2000}>
          <div className="flex flex-col gap-10 justify-center items-center mt-20">
            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex items-center gap-4">
                <CiPhone className="text-[18px] xlg:text-[30px] text-primaryWhite" />
                <a href={`tel:${phone}`} className="text-[18px] md:text-[20px] xlg:text-[34px] text-primaryWhite hover:text-primaryPest transition-colors duration-300">
                  {phone}
                </a>
              </div>
              <div className="flex items-center gap-4">
                <MdOutlineMarkEmailUnread className="text-[18px] xlg:text-[30px] text-primaryWhite" />
                <a href={`mailto:${email}`} className="text-[18px] md:text-[20px] xlg:text-[34px] text-primaryWhite hover:text-primaryPest transition-colors duration-300">
                  {email}
                </a>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 md:gap-10">
              <div className="flex items-center gap-4">
                <FaGithub className="text-[18px] xlg:text-[30px] text-primaryWhite" />
                <Link
                  to={githubPersonalLink}
                  target="_blank"
                  className="text-[18px] md:text-[20px] xlg:text-[34px] text-primaryWhite hover:text-primaryPest transition-colors duration-300"
                >
                  Personal- {githubPersonalUser}
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <FaGithub className="text-[18px] xlg:text-[30px] text-primaryWhite" />
                <Link
                  to={githubOfficialLink}
                  target="_blank"
                  className="text-[18px] md:text-[20px] xlg:text-[34px] text-primaryWhite hover:text-primaryPest transition-colors duration-300"
                >
                  Official- {githubOfficialUser}
                </Link>
              </div>
            </div>
          </div>
        </Fade>
      </div>
    </section>
  );
};

export default ContactWithMe;
