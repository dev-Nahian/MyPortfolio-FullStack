
import HeadingText from "../../component/Common/HeadingText/HeadingText";
import { FaReact } from "react-icons/fa";
import { FaJsSquare } from "react-icons/fa";
import { RiTailwindCssFill } from "react-icons/ri";
import { FaBootstrap } from "react-icons/fa";
import { FaHtml5 } from "react-icons/fa6";
import { DiJqueryLogo } from "react-icons/di";
import { FaSass } from "react-icons/fa";
import { SiRedux } from "react-icons/si";
import { IoLogoFirebase } from "react-icons/io5";
import { FaGitAlt } from "react-icons/fa";
import { IoLogoFigma } from "react-icons/io5";
import { SiAdobexd } from "react-icons/si";
import { Fade } from "react-awesome-reveal";

const MySkills = () => {
  return (
    <section className=" w-full px-10 xlg:px-28 py-10 xlg:py-20">
      <div>
        <div className="flex justify-center">
          <HeadingText
            className="text-[32px] xlg:text-[48px] text-primaryWhite font-semibold"
            text="Technology That I Use"
          />
        </div>

        <div className="w-full xlg:w-[60%] mx-auto">
          <Fade direction="up" triggerOnce duration={2000}>
            <div className="flex flex-wrap gap-3 justify-between mt-20">
              <div>
                <FaReact className="text-[50px] lg:text-[100px] text-[#39C1D7]" />
              </div>
              <div>
                <FaJsSquare className="text-[50px] lg:text-[100px] text-[#FFD600]" />
              </div>
              <div>
                <RiTailwindCssFill className="text-[50px] lg:text-[100px] text-[#39C1D7]" />
              </div>
              <div>
                <FaBootstrap className="text-[50px] lg:text-[100px] text-[#673AB7]" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-between mt-20">
              <div>
                <FaHtml5 className="text-[50px] lg:text-[100px] text-[#E65100] bg-white overflow-hidden" />
              </div>
              <div>
                <DiJqueryLogo className="text-[50px] lg:text-[100px] text-[#39C1D7]" />
              </div>
              <div>
                <FaSass className="text-[50px] lg:text-[100px] text-[#CC6699]" />
              </div>
              <div>
                <SiRedux className="text-[50px] lg:text-[100px] text-[#764ABC]" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3 justify-between mt-20">
              <div>
                <IoLogoFirebase className="text-[50px] lg:text-[100px] text-[#F5820D]" />
              </div>
              <div>
                <FaGitAlt className="text-[50px] lg:text-[100px] text-[#F05033]" />
              </div>
              <div>
                <IoLogoFigma className="text-[50px] lg:text-[100px] text-[#1ABCFE]" />
              </div>
              <div>
                <SiAdobexd className="text-[50px] lg:text-[100px] text-[#450135]" />
              </div>
            </div>
          </Fade>
        </div>
      </div>
    </section>
  );
};

export default MySkills;
