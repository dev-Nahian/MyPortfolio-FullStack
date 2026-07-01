const API_URL = "http://localhost:5050/api";

// Fallback initial data in case the backend is not running
const fallbackProfile = {
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
};

const fallbackProjects = [
  {
    _id: "fb-1",
    title: "Meetboo",
    subtitle: "Interview Platform",
    link: "https://hooviews.com",
    image: "/src/assets/LMS.png",
    order: 1,
  },
  {
    _id: "fb-2",
    title: "The Social Billboard",
    subtitle: "The Social Billboard is a dual-audience web platform built on React and Vite that bridges social media analytics with family-focused content safety.",
    link: "https://thesocialbillboard.com/",
    image: "/src/assets/Social_billboard.png",
    order: 2,
  },
  {
    _id: "fb-3",
    title: "The Media Vault",
    subtitle: "Digital Image and video Selling Website",
    link: "https://themediavault.com",
    image: "/src/assets/Dynamiccenema.png",
    order: 3,
  },
  {
    _id: "fb-4",
    title: "Clone Of Disney+",
    subtitle: "This Is The Project About Disney+ Live Stream, This Project Made With React and Tailwind",
    link: "https://nahian-disney-clone.vercel.app/",
    image: "/src/assets/disneyClone.png",
    order: 4,
  },
  {
    _id: "fb-5",
    title: "Find The Search",
    subtitle: "Empowering individuals to transform through structured fitness challenges.",
    link: "https://findthesearch.com",
    image: "/src/assets/davidheizt.png",
    order: 5,
  },
  {
    _id: "fb-6",
    title: "Keto Diet",
    subtitle: "A website project about the Keto Diet cycle, built with HTML, CSS, JavaScript, and jQuery.",
    link: "https://keto-fhassan.netlify.app",
    image: "/src/assets/KetoDieat.png",
    order: 6,
  },
  {
    _id: "fb-7",
    title: "Hustle",
    subtitle: "A social media platform project designed for connecting and sharing.",
    link: "https://hustle-web.vercel.app/",
    image: "/src/assets/Ehable .png",
    order: 7,
  },
  {
    _id: "fb-8",
    title: "Clone Of Netflix",
    subtitle: "A clone of Netflix for streaming movie data, built with React, Tailwind CSS, and the TMDB API.",
    link: "https://netflix-clone-nahian.vercel.app/",
    image: "/src/assets/netflixClone.png",
    order: 8,
  },
  {
    _id: "fb-9",
    title: "Tic Tac Toe",
    subtitle: "A simple Tic Tac Toe game project made with React and Tailwind.",
    link: "https://nahian-tic-tac-teo-game.vercel.app/",
    image: "/src/assets/ticTacToe.png",
    order: 9,
  },
  {
    _id: "fb-10",
    title: "Official KW",
    subtitle: "An e-commerce clothing brand website project built with HTML, CSS, JavaScript, and jQuery.",
    link: "https://nahian-official-kw.vercel.app/",
    image: "/src/assets/OfficialKw.png",
    order: 10,
  },
];

// Helper to resolve backend image path to absolute URL
export const getImageUrl = (imagePath) => {
  if (!imagePath) return "";
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://") || imagePath.startsWith("data:")) {
    return imagePath;
  }
  if (imagePath.startsWith("/uploads/")) {
    return `http://localhost:5050${imagePath}`;
  }
  return imagePath;
};


export const getProfile = async () => {
  try {
    const res = await fetch(`${API_URL}/profile`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (error) {
    console.warn("Backend not available. Using fallback profile data.", error);
    return fallbackProfile;
  }
};

// Auth helpers
const getAuthHeaders = (extraHeaders = {}) => {
  const token = localStorage.getItem("adminToken");
  return {
    ...extraHeaders,
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const adminLogin = async (username, password) => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Invalid username or password");
  }
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("adminToken", data.token);
  }
  return data;
};

export const updateProfile = async (profileData) => {
  const res = await fetch(`${API_URL}/profile`, {
    method: "PUT",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update profile");
  }
  return await res.json();
};

export const getProjects = async () => {
  try {
    const res = await fetch(`${API_URL}/projects`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (error) {
    console.warn("Backend not available. Using fallback projects data.", error);
    return fallbackProjects;
  }
};

export const createProject = async (formData) => {
  const res = await fetch(`${API_URL}/projects`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to create project");
  }
  return await res.json();
};

export const updateProject = async (id, formData) => {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: formData,
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update project");
  }
  return await res.json();
};

export const deleteProject = async (id) => {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to delete project");
  }
  return await res.json();
};

// Fallbacks for new features
const fallbackSkills = [
  { _id: "fs-1", name: "React", category: "Frontend", proficiency: 90, icon: "FaReact" },
  { _id: "fs-2", name: "JavaScript", category: "Frontend", proficiency: 92, icon: "FaJsSquare" },
  { _id: "fs-3", name: "Tailwind CSS", category: "Frontend", proficiency: 88, icon: "RiTailwindCssFill" },
  { _id: "fs-4", name: "HTML5 & CSS3", category: "Frontend", proficiency: 95, icon: "FaHtml5" },
];

const fallbackExperiences = [
  {
    _id: "fe-1",
    organization: "Softvence Digital Agency",
    title: "Jr. Frontend Developer",
    duration: "2023 - Present",
    description: "Developed and maintained highly responsive, visual, and user-centric web applications utilizing React, TailwindCSS, and modern JS.",
    type: "experience",
    order: 1
  },
  {
    _id: "fe-2",
    organization: "University of Dhaka",
    title: "B.Sc. in Computer Science",
    duration: "2018 - 2022",
    description: "Graduated with honors in Computer Science & Engineering.",
    type: "education",
    order: 3
  }
];

// ==================== SKILLS API ====================
export const getSkills = async () => {
  try {
    const res = await fetch(`${API_URL}/skills`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (error) {
    console.warn("Backend not available. Using fallback skills data.", error);
    return fallbackSkills;
  }
};

export const createSkill = async (skillData) => {
  const res = await fetch(`${API_URL}/skills`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(skillData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to create skill");
  }
  return await res.json();
};

export const updateSkill = async (id, skillData) => {
  const res = await fetch(`${API_URL}/skills/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(skillData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update skill");
  }
  return await res.json();
};

export const deleteSkill = async (id) => {
  const res = await fetch(`${API_URL}/skills/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to delete skill");
  }
  return await res.json();
};

// ==================== EXPERIENCES API ====================
export const getExperiences = async () => {
  try {
    const res = await fetch(`${API_URL}/experiences`);
    if (!res.ok) throw new Error("Backend response error");
    return await res.json();
  } catch (error) {
    console.warn("Backend not available. Using fallback experiences data.", error);
    return fallbackExperiences;
  }
};

export const createExperience = async (expData) => {
  const res = await fetch(`${API_URL}/experiences`, {
    method: "POST",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(expData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to create experience");
  }
  return await res.json();
};

export const updateExperience = async (id, expData) => {
  const res = await fetch(`${API_URL}/experiences/${id}`, {
    method: "PUT",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify(expData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update experience");
  }
  return await res.json();
};

export const deleteExperience = async (id) => {
  const res = await fetch(`${API_URL}/experiences/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to delete experience");
  }
  return await res.json();
};

// ==================== MESSAGES API ====================
export const sendMessage = async (messageData) => {
  const res = await fetch(`${API_URL}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(messageData),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to send message");
  }
  return await res.json();
};

export const getMessages = async () => {
  const res = await fetch(`${API_URL}/messages`, {
    method: "GET",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to retrieve messages");
  }
  return await res.json();
};

export const toggleMessageRead = async (id, read) => {
  const res = await fetch(`${API_URL}/messages/${id}/read`, {
    method: "PUT",
    headers: getAuthHeaders({
      "Content-Type": "application/json",
    }),
    body: JSON.stringify({ read }),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to update message status");
  }
  return await res.json();
};

export const deleteMessage = async (id) => {
  const res = await fetch(`${API_URL}/messages/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || "Failed to delete message");
  }
  return await res.json();
};
