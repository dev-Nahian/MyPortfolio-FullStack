import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import Project from "./models/Project.js";
import Profile from "./models/Profile.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/portfolio");
    console.log("Connected to MongoDB for seeding...");

    // Clear existing data
    await Project.deleteMany({});
    await Profile.deleteMany({});
    console.log("Cleared existing data.");

    // Ensure uploads directory exists
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Helper function to copy images from client assets to server uploads
    const copyImageAsset = (filename) => {
      const srcPath = path.join(__dirname, "../src/assets", filename);
      const destPath = path.join(uploadDir, filename);

      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
        console.log(`Copied image: ${filename}`);
        return `/uploads/${filename}`;
      } else {
        console.warn(`Source image not found: ${srcPath}`);
        // Fallback placeholder or just refer to the relative path in client assets
        return `/uploads/${filename}`;
      }
    };

    // 10 initial projects
    const projectsData = [
      {
        title: "Meetboo",
        subtitle: "Interview Platform",
        link: "https://hooviews.com",
        image: copyImageAsset("LMS.png"),
        order: 1,
      },
      {
        title: "The Social Billboard",
        subtitle: "The Social Billboard is a dual-audience web platform built on React and Vite that bridges social media analytics with family-focused content safety.",
        link: "https://thesocialbillboard.com/",
        image: copyImageAsset("Social_billboard.png"),
        order: 2,
      },
      {
        title: "The Media Vault",
        subtitle: "Digital Image and video Selling Website",
        link: "https://themediavault.com",
        image: copyImageAsset("Dynamiccenema.png"),
        order: 3,
      },
      {
        title: "Clone Of Disney+",
        subtitle: "This Is The Project About Disney+ Live Stream, This Project Made With React and Tailwind",
        link: "https://nahian-disney-clone.vercel.app/",
        image: copyImageAsset("disneyClone.png"),
        order: 4,
      },
      {
        title: "Find The Search",
        subtitle: "Empowering individuals to transform through structured fitness challenges.",
        link: "https://findthesearch.com",
        image: copyImageAsset("davidheizt.png"),
        order: 5,
      },
      {
        title: "Keto Diet",
        subtitle: "A website project about the Keto Diet cycle, built with HTML, CSS, JavaScript, and jQuery.",
        link: "https://keto-fhassan.netlify.app",
        image: copyImageAsset("KetoDieat.png"),
        order: 6,
      },
      {
        title: "Hustle",
        subtitle: "A social media platform project designed for connecting and sharing.",
        link: "https://hustle-web.vercel.app/",
        image: copyImageAsset("Ehable .png"),
        order: 7,
      },
      {
        title: "Clone Of Netflix",
        subtitle: "A clone of Netflix for streaming movie data, built with React, Tailwind CSS, and the TMDB API.",
        link: "https://netflix-clone-nahian.vercel.app/",
        image: copyImageAsset("netflixClone.png"),
        order: 8,
      },
      {
        title: "Tic Tac Toe",
        subtitle: "A simple Tic Tac Toe game project made with React and Tailwind.",
        link: "https://nahian-tic-tac-teo-game.vercel.app/",
        image: copyImageAsset("ticTacToe.png"),
        order: 9,
      },
      {
        title: "Official KW",
        subtitle: "An e-commerce clothing brand website project built with HTML, CSS, JavaScript, and jQuery.",
        link: "https://nahian-official-kw.vercel.app/",
        image: copyImageAsset("OfficialKw.png"),
        order: 10,
      },
    ];

    await Project.insertMany(projectsData);
    console.log("Seeded 10 projects.");

    // Seed Profile
    const profileData = new Profile({
      name: "Al Nahian Rafi",
      typewriterStrings: ["Developer.", "React Developer.", "Front-End Developer."],
      intro: "Hi there",
      aboutParagraph1: "I’m Al Nahian Rafi, currently I live in Bangladesh working as a Jr. Frontend Developer at Softvence Digital Agency. I specialize in creating seamless and interactive user experiences that bring web designs to life. With expertise in HTML, CSS, JavaScript, and modern frameworks like React, I have a strong foundation in crafting responsive, accessible, and visually appealing websites and applications. I prioritize clean, efficient code and stay updated with the latest technologies and best practices to ensure my projects are both innovative and functional across devices and platforms.",
      aboutParagraph2: "In addition to technical skills, I bring a keen eye for UX design and a focus on user-centered development. This allows me to collaborate effectively with designers, back-end developers, and stakeholders to deliver intuitive and engaging digital products. I’m constantly learning and experimenting with new tools, techniques, and animations to elevate my projects and provide end-users with memorable and impactful experiences.",
      agencyName: "Softvence Digital Agency",
      agencyLink: "https://softvence.agency/",
      phone: "+8801761186858",
      email: "Alrafi321@icloud.com",
      githubPersonalLink: "https://github.com/dev-nahianrafi",
      githubPersonalUser: "dev-nahianrafi",
      githubOfficialLink: "https://github.com/dev-Nahian",
      githubOfficialUser: "dev-Nahian",
    });

    await profileData.save();
    console.log("Seeded profile settings.");

    console.log("Seeding completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
};

seed();
