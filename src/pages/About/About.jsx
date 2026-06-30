
import { Fade } from "react-awesome-reveal";
import AboutMe from "../../component/AboutComponents/AboutMe";
import MyImg from "../../assets/Al-Nahian-Rafi.jpg";

const About = () => {
  return (
    <section
      id="about"
      className="text-white w-full flex justify-center items-center px-5 lg:px-16 2xl:px-28 py-10 xl:py-20"
    >
      <Fade direction="up" triggerOnce={true} duration={2000}>
        <div className="h-full w-full flex justify-center items-center">
          <div className="w-full flex flex-col lg:flex-row items-center gap-y-5 gap-x-[5%]">
            <div className="w-full xl:w-[50%]">
              <AboutMe />
            </div>

            <div className="w-full xl:w-[45%] h-[250px] md:h-[350px] lg:h-[800px]">
              {/* <Fade direction="up" duration={2500}> */}
              <img
                className="h-full w-full object-fill lg:object-cover rounded-[30px]"
                src={MyImg}
                alt="not found"
              />
              {/* </Fade> */}
            </div>
          </div>
        </div>
      </Fade>
    </section>
  );
};

export default About;
