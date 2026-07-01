import { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";
import { FaArrowRight, FaSearch } from "react-icons/fa";
import HeadingTwo from "../../component/Common/HeadingTwo/HeadingTwo";
import SubHeading from "../../component/Common/SubHeading/SubHeading";
import HeadingText from "../../component/Common/HeadingText/HeadingText";
import { getProjects, getImageUrl } from "../../shared/api";

const Project = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All");

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

  // Get all unique tags from projects
  const allTags = ["All", ...new Set(projects.flatMap((p) => p.tags || []))];

  // Filter projects by both search query and selected tag
  const filteredProjects = projects.filter((project) => {
    const matchesTag =
      selectedTag === "All" || (project.tags && project.tags.includes(selectedTag));
    const matchesSearch =
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.tags && project.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchesTag && matchesSearch;
  });

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="text-primaryPest text-xl animate-pulse">Loading Projects...</div>
      </div>
    );
  }

  return (
    <section id="project" className="w-full py-[60px] xlg:py-[100px] px-5 lg:px-16 2xl:px-28">
      {/* Header & Controls */}
      <div className="w-full flex flex-col justify-center items-center mb-16">
        <HeadingText
          className="text-[32px] xlg:text-[48px] text-primaryWhite font-semibold"
          text="Featured Work"
        />
        <p className="text-primaryWhite600 text-sm mt-3 text-center max-w-xl">
          Explore a showcase of applications, interfaces, and open-source contributions.
        </p>

        {/* Filter Controls Container */}
        <div className="w-full max-w-4xl mt-12 flex flex-col md:flex-row gap-6 justify-between items-center bg-white/5 border border-white/10 rounded-2xl p-4 backdrop-blur-md">
          {/* Search bar */}
          <div className="relative w-full md:w-[320px]">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-primaryWhite600">
              <FaSearch size={14} />
            </span>
            <input
              type="text"
              placeholder="Search project by stack, title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/40 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-sm text-white placeholder-primaryWhite600 focus:outline-none focus:border-primaryPest focus:ring-1 focus:ring-primaryPest transition-all duration-300"
            />
          </div>

          {/* Tag Filter Pills */}
          <div className="flex flex-wrap gap-2 justify-center max-w-full overflow-x-auto py-1">
            {allTags.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide border transition-all duration-300 ${
                  selectedTag === tag
                    ? "bg-primaryPest text-black border-primaryPest shadow-lg shadow-primaryPest/20"
                    : "bg-transparent text-primaryWhite600 border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Projects List */}
      {filteredProjects.length === 0 ? (
        <div className="w-full py-16 text-center text-primaryWhite600 border border-dashed border-white/10 rounded-2xl">
          No projects matched your criteria. Try adjusting your search query or filters.
        </div>
      ) : (
        <div className="w-full flex flex-col gap-0">
          {filteredProjects.map((project, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={project._id || index} className="py-[60px] xlg:py-[100px] w-full flex justify-center items-center border-b border-white/5 last:border-b-0">
                <div
                  className={`w-full gap-x-[8%] gap-y-10 flex flex-col justify-between items-center ${
                    isEven ? "xlg:flex-row" : "xlg:flex-row-reverse"
                  }`}
                >
                  {/* Image Container */}
                  <div className="w-full lg:w-[50%] h-[350px] lg:h-[500px] overflow-y-hidden relative ImageHover rounded-xl group border border-white/10 shadow-2xl">
                    <Fade triggerOnce direction="down" duration={2000}>
                      <img
                        className="w-full h-full object-cover xl:object-fill rounded-xl okei transition-transform duration-700 group-hover:scale-105"
                        src={getImageUrl(project.image)}
                        alt={project.title}
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000";
                        }}
                      />
                      <div className="absolute h-0 w-full backdrop-blur-[2px] left-0 top-0 hoverdItem bg-black/40"></div>
                    </Fade>
                  </div>

                  {/* Text Container */}
                  <div className="w-[95%] xlg:w-[42%]">
                    <Fade triggerOnce direction="left" duration={2000}>
                      <div className="flex flex-col gap-5 lg:gap-8">
                        <div className="space-y-3">
                          {/* Tags */}
                          {project.tags && project.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="text-[10px] font-bold px-2.5 py-1 rounded bg-primaryPest/10 border border-primaryPest/20 text-primaryPest uppercase tracking-widest"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                          <HeadingTwo text={project.title} />
                        </div>

                        <SubHeading text={project.subtitle} />

                        <div className="w-[150px] lg:w-[250px] relative text-center z-[11] py-[10px] cursor-pointer mainHover">
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
        </div>
      )}
    </section>
  );
};

export default Project;
