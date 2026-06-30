
import HeadingTwo from "../Common/HeadingTwo/HeadingTwo";
import Ehabal from "../../assets/Ehable .png";
import SubHeading from "../Common/SubHeading/SubHeading";
import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { Fade } from "react-awesome-reveal";


const Project4 = () => {
  return (
    <section>
      <div className="py-[80px] xlg:py-[160px] w-full flex justify-center items-center">
        <div className="w-full gap-x-[2%] gap-y-5  flex flex-col-reverse xlg:flex-row justify-between 2xl:items-center px-5 lg:px-10">
          <div className="w-[90%] lg:w-[50%] h-[450px] lg:h-[700px] overflow-y-hidden relative ImageHover">
            <Fade direction="down" triggerOnce duration={2000}>
              <img
                className="w-full h-full object-cover xl:object-fill rounded-xl okei"
                src={Ehabal}
                alt="not found"
              />
              <div className=" absolute h-0 w-full backdrop-blur-[4px] left-0 top-0 hoverdItem"></div>
            </Fade>
          </div>

          <div className="w-[80%] xlg:w-[46%]">
            <Fade direction="left" triggerOnce duration={2000}>
              <div className="flex flex-col gap-10">
                <HeadingTwo text="Hustle" />
                <SubHeading text="A social media platform project designed for connecting and sharing." />

                <div className="w-[150px]  lg:w-[250px] relative text-center z-[111] py-[10px] cursor-pointer mainHover">
                  <Link
                    className="flex gap-2 items-center justify-center w-full text-[18px] lg:text-[22px] text-center text-primaryWhite relative z-[11111]"
                    to="https://hustle-web.vercel.app/"
                    target="_"
                  >
                    View Project{" "}
                    <FaArrowRight className="text-primaryWhite text-[20px]" />
                  </Link>
                  <div className="absolute w-[15%] h-full bg-primaryPest left-0 top-0 z-10 hoverElemet"></div>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Project4;
