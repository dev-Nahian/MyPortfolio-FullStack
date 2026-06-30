import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      default: "Al Nahian Rafi",
    },
    typewriterStrings: {
      type: [String],
      default: ["Developer.", "React Developer.", "Front-End Developer."],
    },
    intro: {
      type: String,
      default: "Hi there",
    },
    aboutParagraph1: {
      type: String,
      default: "",
    },
    aboutParagraph2: {
      type: String,
      default: "",
    },
    agencyName: {
      type: String,
      default: "Softvence Digital Agency",
    },
    agencyLink: {
      type: String,
      default: "https://softvence.agency/",
    },
    phone: {
      type: String,
      default: "+8801761186858",
    },
    email: {
      type: String,
      default: "Alrafi321@icloud.com",
    },
    githubPersonalLink: {
      type: String,
      default: "https://github.com/dev-nahianrafi",
    },
    githubPersonalUser: {
      type: String,
      default: "dev-nahianrafi",
    },
    githubOfficialLink: {
      type: String,
      default: "https://github.com/dev-Nahian",
    },
    githubOfficialUser: {
      type: String,
      default: "dev-Nahian",
    },
  },
  { timestamps: true }
);

const Profile = mongoose.model("Profile", profileSchema);
export default Profile;
