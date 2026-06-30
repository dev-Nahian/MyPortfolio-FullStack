import HeadingTwo from "../Common/HeadingTwo/HeadingTwo";
import NetflixClone from "../../assets/netflixClone.png";
import SubHeading from "../Common/SubHeading/SubHeading";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";

export default function Project7() {
  return (
    <section>
      <div className="py-[80px] xlg:py-[160px] w-full flex justify-center items-center">
        <div className="w-full gap-x-[2%] gap-y-5  flex flex-col-reverse xlg:flex-row justify-between items-center px-5 lg:px-10">
          <div className=" w-[80%] xlg:w-[28%]">
            <Fade direction="left" triggerOnce duration={2000}>
              <div className="flex flex-col gap-6 lg:gap-10">
                <HeadingTwo text="Clone Of Netflix" />
                <SubHeading text="A clone of Netflix for streaming movie data, built with React, Tailwind CSS, and the TMDB API." />

                <div className="w-[150px]  lg:w-[250px] relative text-center z-[111] py-[10px] cursor-pointer mainHover">
                  <Link
                    className="flex gap-2 items-center justify-center w-full text-[18px] lg:text-[22px] text-center text-primaryWhite relative z-[11111]"
                    to="https://netflix-clone-nahian.vercel.app/"
                    target="_"
                  >
                    View Project{" "}
                    <FaArrowRight className="text-primaryWhite text-[16px] lg:text-[20px]" />
                  </Link>
                  <div className="absolute w-[15%] h-full bg-primaryPest left-0 top-0 z-10 hoverElemet"></div>
                </div>
              </div>
            </Fade>
          </div>

          <div className="w-[80%] lg:w-[60%] h-[450px] lg:h-[700px] overflow-y-hidden relative ImageHover">
            <Fade className="h-full w-full" direction="down" triggerOnce duration={2000}>
              <img
                className="w-full h-full object-fill rounded"
                src={NetflixClone}
                alt="not found"
              />
              <div className=" absolute h-0 w-full backdrop-blur-[4px] left-0 top-0 hoverdItem"></div>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}
