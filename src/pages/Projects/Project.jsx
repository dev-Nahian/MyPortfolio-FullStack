import { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { FaArrowRight } from "react-icons/fa";
import HeadingTwo from "../../component/Common/HeadingTwo/HeadingTwo";
import SubHeading from "../../component/Common/SubHeading/SubHeading";
import { getProjects, getImageUrl } from "../../shared/api";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getProjects();
        setProjects(data);
      } catch (error) {
        console.error("Error loading projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="text-primaryPest text-xl animate-pulse">Loading Projects...</div>
      </div>
    );
  }

  return (
    <section id="project" className="w-full">
      {projects.map((project, index) => {
        const isEven = index % 2 === 0;
        return (
          <div key={project._id || index} className="py-[80px] xlg:py-[120px] w-full flex justify-center items-center">
            <div
              className={`w-full gap-x-[6%] gap-y-10 flex flex-col justify-between items-center px-5 lg:px-10 ${
                isEven ? "xlg:flex-row" : "xlg:flex-row-reverse"
              }`}
            >
              {/* Image Container */}
              <div className="w-full lg:w-[50%] h-[400px] lg:h-[550px] overflow-y-hidden relative ImageHover">
                <Fade triggerOnce direction="down" duration={2000}>
                  <img
                    className="w-full h-full object-cover xl:object-fill rounded-xl okei"
                    src={getImageUrl(project.image)}
                    alt={project.title}
                    onError={(e) => {
                      // Fallback image if there's any loading issue
                      e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000";
                    }}
                  />
                  <div className="absolute h-0 w-full backdrop-blur-[4px] left-0 top-0 hoverdItem"></div>
                </Fade>
              </div>

              {/* Text Container */}
              <div className="w-[90%] xlg:w-[40%]">
                <Fade triggerOnce direction="left" duration={2000}>
                  <div className="flex flex-col gap-6 lg:gap-10">
                    <HeadingTwo text={project.title} />
                    <SubHeading text={project.subtitle} />

                    <div className="w-[150px] lg:w-[250px] relative text-center z-[111] py-[10px] cursor-pointer mainHover">
                      <a
                        className="flex gap-2 items-center justify-center w-full text-[18px] lg:text-[22px] text-center text-primaryWhite relative z-[11111]"
                        href={project.link}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Project{" "}
                        <FaArrowRight className="text-primaryWhite text-[16px] lg:text-[20px]" />
                      </a>
                      <div className="absolute w-[15%] h-full bg-primaryPest left-0 top-0 z-10 hoverElemet"></div>
                    </div>
                  </div>
                </Fade>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
};

export default Project;
