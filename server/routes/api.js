import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Project from "../models/Project.js";
import Profile from "../models/Profile.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Middleware to check database connection status
const checkDbConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      message: "MongoDB database is offline. Please make sure MongoDB is running locally (port 27017) to edit content or manage projects."
    });
  }
  next();
};

router.use(checkDbConnection);

// Authentication helper middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Access denied. Authentication token missing." });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = Buffer.from(token, "base64").toString("ascii");
    const [username, expiry] = decoded.split(":");
    const adminUser = process.env.ADMIN_USERNAME || "admin";

    if (username !== adminUser || Date.now() > parseInt(expiry)) {
      return res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token format." });
  }
};

// ==================== AUTH ROUTES ====================
router.post("/auth/login", (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USERNAME || "admin";
  const adminPass = process.env.ADMIN_PASSWORD || "admin123";

  if (username === adminUser && password === adminPass) {
    // Generate a simple token (base64 encoded 'username:expiry_timestamp')
    const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours from now
    const token = Buffer.from(`${username}:${expiry}`).toString("base64");
    return res.json({ success: true, token });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});


// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPG, PNG, GIF, and WEBP are allowed."), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// ==================== PROJECTS ROUTES ====================

// GET all projects
router.get("/projects", async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1, createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create project
router.post("/projects", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, link, order } = req.body;
    let imagePath = "";

    if (req.file) {
      // Save relative url path
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      // Fallback to text URL if provided
      imagePath = req.body.image;
    } else {
      return res.status(400).json({ message: "Image is required" });
    }

    const newProject = new Project({
      title,
      subtitle,
      link,
      image: imagePath,
      order: order ? parseInt(order) : 0,
    });

    const savedProject = await newProject.save();
    res.status(201).json(savedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update project
router.put("/projects/:id", requireAuth, upload.single("image"), async (req, res) => {
  try {
    const { title, subtitle, link, order } = req.body;
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (title) project.title = title;
    if (subtitle) project.subtitle = subtitle;
    if (link) project.link = link;
    if (order !== undefined) project.order = parseInt(order);

    if (req.file) {
      // Delete old file if it was a local upload
      if (project.image.startsWith("/uploads/")) {
        const oldPath = path.join(__dirname, "..", project.image);
        if (fs.existsSync(oldPath)) {
          fs.unlinkSync(oldPath);
        }
      }
      project.image = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      project.image = req.body.image;
    }

    const updatedProject = await project.save();
    res.json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE project
router.delete("/projects/:id", requireAuth, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Delete image if it's local
    if (project.image.startsWith("/uploads/")) {
      const imgPath = path.join(__dirname, "..", project.image);
      if (fs.existsSync(imgPath)) {
        fs.unlinkSync(imgPath);
      }
    }

    await Project.deleteOne({ _id: req.params.id });
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ==================== PROFILE ROUTES ====================

// GET profile (returns default or the first document)
router.get("/profile", async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      // Create default
      profile = new Profile({
        aboutParagraph1: "I’m Al Nahian Rafi, currently I live in Bangladesh working as a Jr. Frontend Developer at Softvence Digital Agency. I specialize in creating seamless and interactive user experiences that bring web designs to life. With expertise in HTML, CSS, JavaScript, and modern frameworks like React, I have a strong foundation in crafting responsive, accessible, and visually appealing websites and applications. I prioritize clean, efficient code and stay updated with the latest technologies and best practices to ensure my projects are both innovative and functional across devices and platforms.",
        aboutParagraph2: "In addition to technical skills, I bring a keen eye for UX design and a focus on user-centered development. This allows me to collaborate effectively with designers, back-end developers, and stakeholders to deliver intuitive and engaging digital products. I’m constantly learning and experimenting with new tools, techniques, and animations to elevate my projects and provide end-users with memorable and impactful experiences.",
      });
      await profile.save();
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT update profile
router.put("/profile", requireAuth, async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile();
    }

    const fields = [
      "name",
      "typewriterStrings",
      "intro",
      "aboutParagraph1",
      "aboutParagraph2",
      "agencyName",
      "agencyLink",
      "phone",
      "email",
      "githubPersonalLink",
      "githubPersonalUser",
      "githubOfficialLink",
      "githubOfficialUser",
    ];

    fields.forEach((field) => {
      if (req.body[field] !== undefined) {
        profile[field] = req.body[field];
      }
    });

    const updatedProfile = await profile.save();
    res.json(updatedProfile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
