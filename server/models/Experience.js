import mongoose from "mongoose";

const experienceSchema = new mongoose.Schema(
  {
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
      placeholder: "e.g. 2023 - Present or Jan 2022 - Dec 2022",
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["experience", "education"],
      default: "experience",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Experience = mongoose.model("Experience", experienceSchema);
export default Experience;
