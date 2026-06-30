import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FiInstagram } from "react-icons/fi";
import Linkss from "react-scroll/modules/components/Link";
import { Link } from "react-router-dom";
import MyImg from '../../assets/nahian.jpeg';
import { CiMenuFries } from "react-icons/ci";





const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle sidebar
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Toggle button for smaller screens */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 text-white p-2 rounded"
        onClick={toggleSidebar}
      >
        <CiMenuFries className="text-[30px]" />
      </button>

      {/* Sidebar */}
      <section
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 sticky lg:sticky lg:block w-[15%] sm:w-[50%] md:w-[15%] lg:w-[15%] top-0 bg-red h-[100vh] py-5 text-center transition-transform duration-300 mt-3 z-40`}
      >
        <div className="w-full py-10 md:py-20 flex flex-col h-full justify-between">
          <div className="h-[50%] xlg:h-[40%] flex flex-col justify-between gap-5">
            <div className="flex justify-center items-center">
              <Linkss to="/">
                <div className="lg:block h-10 w-10 rounded-full bg-red-500">
                  <img src={MyImg} className="h-full w-full rounded-full object-cover" alt="" />
                </div>
              </Linkss>
            </div>

            <div className="-rotate-90 h-fit mt-[200px] md:mt-[180px]">
              <ul className="flex flex-row gap-5 -rotate-145">
                {["Home", "About", "Project", "Contact"].map((section) => (
                  <li key={section}>
                    <Linkss
                      to={section.toLowerCase()}
                      smooth={true}
                      duration={500}
                      className="text-[16px] text-[#fffa] font-semibold relative after:absolute after:content-[''] after:h-[3px] after:w-0 after:transition-[width] after:ease-linear after:duration-300 after:left-0 after:top-1/2 after:translate-y-1/2 after:bg-primaryPest hover:after:w-full"
                      onClick={toggleSidebar}  // Close sidebar on link click
                    >
                      {section}
                    </Linkss>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="h-[40%] flex flex-col gap-6 justify-end items-center mt-10">
            <div>
              <Link to="https://github.com/dev-Nahian" target="_">
                <FaGithub className="text-white text-[24px] transition-all ease-linear duration-[0.3s] hover:text-primaryPest cursor-pointer" />
              </Link>
            </div>
            <div>
              <Link to="https://www.linkedin.com/in/al-nahian-rafi" target="_">
                <FaLinkedinIn className="text-white text-[24px] transition-all ease-linear duration-[0.3s] hover:text-primaryPest cursor-pointer" />
              </Link>
            </div>
            <div>
              <FiInstagram className="text-white text-[24px] transition-all ease-linear duration-[0.3s] hover:text-primaryPest cursor-pointer" />
            </div>
          </div>
        </div>
      </section>

      {/* Overlay for smaller screens when sidebar is open */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black opacity-50 z-30"
          onClick={toggleSidebar}
        ></div>
      )}
    </>
  );
};

export default Navbar;
