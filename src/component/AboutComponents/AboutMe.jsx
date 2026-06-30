import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getProfile } from "../../shared/api";

const AboutMe = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile in AboutMe:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return <div className="text-primaryPest animate-pulse">Loading About Details...</div>;
  }

  const name = profile?.name || "Al Nahian Rafi";
  const intro = profile?.intro || "Hi there";
  const agencyName = profile?.agencyName || "Softvence Digital Agency";
  const agencyLink = profile?.agencyLink || "https://softvence.agency/";

  return (
    <div>
      <h3 className="mb-5 text-primaryWhite text-[18px] xl:text-[24px] 2xl:text-[32px] font-normal capitalize">
        {intro}
      </h3>

      <h3 className="text-primaryWhite600 text-[16px] xl:text-[18px] 2xl:text-[24px] font-light leading-[28px] xl:leading-[38px] ">
        {profile?.aboutParagraph1 ? (
          <span>{profile.aboutParagraph1}</span>
        ) : (
          <span>
            I’m {name}, currently I live in Bangladesh working as a Jr.
            Frontend Developer at{" "}
            <Link
              className="underline text-primaryPest"
              to={agencyLink}
              target="_blank"
            >
              {agencyName}{" "}
            </Link>
            . I specialize in creating seamless and interactive user experiences
            that bring web designs to life. With expertise in HTML, CSS,
            JavaScript, and modern frameworks like React, I have a strong
            foundation in crafting responsive, accessible, and visually appealing
            websites and applications.
          </span>
        )}

        <br />
        <br />

        {profile?.aboutParagraph2 ? (
          <span>{profile.aboutParagraph2}</span>
        ) : (
          <span>
            In addition to technical skills, I bring a keen eye for UX design and
            a focus on user-centered development. This allows me to collaborate
            effectively with designers, back-end developers, and stakeholders to
            deliver intuitive and engaging digital products.
          </span>
        )}
      </h3>
    </div>
  );
};

export default AboutMe;
