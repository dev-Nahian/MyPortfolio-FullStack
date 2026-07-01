import mongoose from "mongoose";

const skillSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: ["Frontend", "Backend", "Tools & Design", "Other"],
      default: "Frontend",
    },
    proficiency: {
      type: Number,
      min: 0,
      max: 100,
      default: 80,
    },
    icon: {
      type: String,
      required: true,
      trim: true,
      default: "FaReact",
    },
  },
  { timestamps: true }
);

const Skill = mongoose.model("Skill", skillSchema);
export default Skill;
