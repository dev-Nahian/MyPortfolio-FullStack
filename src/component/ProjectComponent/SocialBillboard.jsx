import HeadingTwo from "../Common/HeadingTwo/HeadingTwo";
import Social_billboard from "../../assets/Social_billboard.png";
import SubHeading from "../Common/SubHeading/SubHeading";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";

const SocialBillboard = () => {
  return (
    <section>
      <div className="py-[80px] xlg:py-[160px] w-full flex justify-center items-center">
        <div className="w-full gap-x-[2%] gap-y-5  flex flex-col-reverse xlg:flex-row justify-between items-center px-5 lg:px-10">
          <div className=" w-[80%] xlg:w-[28%]">
            <Fade triggerOnce direction="left" duration={2000}>
              <div className="flex flex-col gap-6 lg:gap-10">
                <HeadingTwo text="The Social Billboard" />
                <SubHeading text="The Social Billboard is a dual-audience web platform built on React and Vite that bridges social media analytics with family-focused content safety." />

                <div className="w-[150px]  lg:w-[250px] relative text-center z-[111] py-[10px] cursor-pointer mainHover">
                  <Link
                    className="flex gap-2 items-center justify-center w-full text-[18px] lg:text-[22px] text-center text-primaryWhite relative z-[11111]"
                    to="https://thesocialbillboard.com/"
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
            <Fade triggerOnce direction="down" duration={2000}>
              <img
                className="w-full h-full object-fill rounded"
                src={Social_billboard}
                alt="not found"
              />
              <div className=" absolute h-0 w-full backdrop-blur-[4px] left-0 top-0 hoverdItem"></div>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SocialBillboard;
