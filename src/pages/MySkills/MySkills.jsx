
import { useState, useEffect } from "react";
import HeadingText from "../../component/Common/HeadingText/HeadingText";
import { getSkills } from "../../shared/api";
import { Fade } from "react-awesome-reveal";

// Import all icon libraries to resolve them dynamically
import * as Fa from "react-icons/fa";
import * as Fa6 from "react-icons/fa6";
import * as Ri from "react-icons/ri";
import * as Di from "react-icons/di";
import * as Si from "react-icons/si";
import * as Io5 from "react-icons/io5";
import * as Tb from "react-icons/tb";

const MySkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const data = await getSkills();
        setSkills(data);
      } catch (error) {
        console.error("Error loading skills:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const categories = ["All", "Frontend", "Backend", "Tools & Design"];

  const filteredSkills = skills.filter(
    (skill) => activeCategory === "All" || skill.category === activeCategory
  );

  const getIconComponent = (iconName) => {
    if (!iconName) return <Fa.FaCode />;
    // Check various packs
    const icon =
      Fa[iconName] ||
      Fa6[iconName] ||
      Ri[iconName] ||
      Di[iconName] ||
      Si[iconName] ||
      Io5[iconName] ||
      Tb[iconName];

    if (icon) {
      const IconComp = icon;
      return <IconComp />;
    }
    return <Fa.FaCode />;
  };

  // Helper color map based on skill name / category for premium aesthetic look
  const getSkillColor = (skillName) => {
    const lower = skillName.toLowerCase();
    if (lower.includes("react")) return "text-[#39C1D7]";
    if (lower.includes("javascript") || lower.includes("js")) return "text-[#FFD600]";
    if (lower.includes("tailwind")) return "text-[#38BDF8]";
    if (lower.includes("bootstrap")) return "text-[#7952B3]";
    if (lower.includes("html") || lower.includes("css")) return "text-[#E34F26]";
    if (lower.includes("sass")) return "text-[#CC6699]";
    if (lower.includes("redux")) return "text-[#764ABC]";
    if (lower.includes("firebase")) return "text-[#FFCA28]";
    if (lower.includes("git")) return "text-[#F05032]";
    if (lower.includes("figma")) return "text-[#F24E1E]";
    if (lower.includes("node") || lower.includes("express")) return "text-[#339933]";
    if (lower.includes("adobe")) return "text-[#FF0000]";
    return "text-primaryPest";
  };

  if (loading) {
    return (
      <div className="w-full py-20 flex justify-center items-center">
        <div className="text-primaryPest text-xl animate-pulse">Syncing Skill Matrix...</div>
      </div>
    );
  }

  return (
    <section id="skills" className="w-full px-5 lg:px-16 2xl:px-28 py-16 xlg:py-24">
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="flex flex-col items-center justify-center text-center mb-12">
          <HeadingText
            className="text-[32px] xlg:text-[48px] text-primaryWhite font-semibold"
            text="Tech Stack & Expertise"
          />
          <p className="text-primaryWhite600 text-sm mt-3 max-w-xl">
            A list of languages, libraries, framework APIs, and tools that I regularly use.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex justify-center mb-16">
          <div className="flex bg-white/5 border border-white/10 p-1.5 rounded-xl backdrop-blur-sm">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs lg:text-sm font-semibold tracking-wide transition-all duration-300 ${
                  activeCategory === cat
                    ? "bg-primaryPest text-black shadow-md shadow-primaryPest/15 font-bold"
                    : "text-primaryWhite600 hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Display */}
        {filteredSkills.length === 0 ? (
          <div className="text-center text-primaryWhite600 py-12 border border-dashed border-white/10 rounded-2xl">
            No skills found in this category.
          </div>
        ) : (
          <Fade direction="up" triggerOnce duration={1500}>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredSkills.map((skill) => (
                <div
                  key={skill._id}
                  className="group bg-white/5 border border-white/5 hover:border-primaryPest/30 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between items-center text-center relative overflow-hidden hover:shadow-xl hover:shadow-primaryPest/5"
                >
                  {/* Decorative background glow */}
                  <div className="absolute -right-4 -bottom-4 w-12 h-12 bg-primaryPest/10 rounded-full blur-xl group-hover:bg-primaryPest/20 transition-colors duration-500"></div>

                  {/* Icon */}
                  <div className={`mb-4 transition-transform duration-500 group-hover:scale-110 ${getSkillColor(skill.name)}`}>
                    <span className="text-[50px] lg:text-[70px] block">
                      {getIconComponent(skill.icon)}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-1 w-full">
                    <h4 className="text-primaryWhite font-medium text-base lg:text-lg group-hover:text-primaryPest transition-colors duration-300">
                      {skill.name}
                    </h4>
                    <p className="text-primaryWhite600 text-xs tracking-wider uppercase">
                      {skill.category}
                    </p>

                    {/* Dynamic Proficiency bar */}
                    <div className="mt-4 pt-2 space-y-1">
                      <div className="flex justify-between items-center text-[10px] text-primaryWhite600">
                        <span>Proficiency</span>
                        <span className="font-semibold">{skill.proficiency}%</span>
                      </div>
                      <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primaryPest rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${skill.proficiency}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Fade>
        )}
      </div>
    </section>
  );
};

export default MySkills;
