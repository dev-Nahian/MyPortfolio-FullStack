import { useState, useEffect } from "react";
import HeadingText from "../../component/Common/HeadingText/HeadingText";
import { getExperiences } from "../../shared/api";
import { Fade } from "react-awesome-reveal";
import { FaBriefcase, FaGraduationCap, FaCalendarAlt } from "react-icons/fa";

const MyJourney = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        const data = await getExperiences();
        setItems(data);
      } catch (error) {
        console.error("Error loading journey timeline:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchJourney();
  }, []);

  const filteredItems = items.filter((item) => {
    if (activeTab === "all") return true;
    return item.type === activeTab;
  });

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="text-primaryPest text-xl animate-pulse">Syncing Journey Timeline...</div>
      </div>
    );
  }

  return (
    <section id="journey" className="w-full px-5 lg:px-16 2xl:px-28 py-16 xlg:py-24">
      <div className="max-w-4xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <HeadingText
            className="text-[32px] xlg:text-[48px] text-primaryWhite font-semibold"
            text="My Journey"
          />
          <p className="text-primaryWhite600 text-sm mt-3 max-w-xl">
            A chronological timeline of my professional experience and education background.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-16">
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-xl backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-5 py-2 rounded-lg text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 ${
                activeTab === "all"
                  ? "bg-primaryPest text-black shadow-md shadow-primaryPest/15 font-bold"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              Show All
            </button>
            <button
              onClick={() => setActiveTab("experience")}
              className={`px-5 py-2 rounded-lg text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                activeTab === "experience"
                  ? "bg-primaryPest text-black shadow-md shadow-primaryPest/15 font-bold"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              <FaBriefcase size={12} /> Work Experience
            </button>
            <button
              onClick={() => setActiveTab("education")}
              className={`px-5 py-2 rounded-lg text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 flex items-center gap-2 ${
                activeTab === "education"
                  ? "bg-primaryPest text-black shadow-md shadow-primaryPest/15 font-bold"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              <FaGraduationCap size={14} /> Education
            </button>
          </div>
        </div>

        {/* Timeline Container */}
        {filteredItems.length === 0 ? (
          <div className="text-center text-primaryWhite600 py-12 border border-dashed border-white/10 rounded-2xl">
            No entries found.
          </div>
        ) : (
          <div className="relative border-l border-white/10 pl-6 lg:pl-10 ml-4 lg:ml-10 space-y-12">
            {filteredItems.map((item, index) => (
              <Fade key={item._id || index} triggerOnce direction="up" duration={1000} delay={index * 100}>
                <div className="relative group">
                  {/* Timeline bullet icon */}
                  <span className="absolute -left-[39px] lg:-left-[55px] top-1.5 flex items-center justify-center w-6 h-6 lg:w-8 lg:h-8 rounded-full bg-[oklch(15%_0_0)] border-2 border-white/20 group-hover:border-primaryPest group-hover:bg-primaryPest group-hover:text-black transition-all duration-500 text-primaryWhite600 text-xs lg:text-sm shadow-md">
                    {item.type === "experience" ? <FaBriefcase size={12} /> : <FaGraduationCap size={14} />}
                  </span>

                  {/* Timeline Card */}
                  <div className="bg-white/5 border border-white/5 group-hover:border-primaryPest/30 rounded-2xl p-6 lg:p-8 transition-all duration-300 relative shadow-lg group-hover:shadow-xl group-hover:shadow-primaryPest/5">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                      <div>
                        <h4 className="text-primaryWhite text-lg lg:text-xl font-semibold group-hover:text-primaryPest transition-colors duration-300">
                          {item.title}
                        </h4>
                        <p className="text-primaryPest/80 text-sm font-medium mt-1">
                          {item.organization}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 text-xs font-semibold text-primaryWhite600 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full w-fit">
                        <FaCalendarAlt size={10} className="text-primaryPest" />
                        <span>{item.duration}</span>
                      </div>
                    </div>

                    {/* Body Description */}
                    <p className="text-primaryWhite600 text-sm leading-relaxed whitespace-pre-line">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyJourney;
