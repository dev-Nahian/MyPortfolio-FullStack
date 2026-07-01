import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaArrowLeft,
  FaGlobe,
  FaEye,
  FaEnvelope,
  FaEnvelopeOpen,
} from "react-icons/fa";
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getProfile,
  updateProfile,
  getImageUrl,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  getMessages,
  toggleMessageRead,
  deleteMessage,
} from "../../shared/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState({});
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  // Project form state
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    subtitle: "",
    link: "",
    order: "0",
    tags: "",
    image: null,
    imageUrl: "",
  });

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "",
    typewriterStrings: "",
    intro: "",
    aboutParagraph1: "",
    aboutParagraph2: "",
    agencyName: "",
    agencyLink: "",
    phone: "",
    email: "",
    githubPersonalLink: "",
    githubPersonalUser: "",
    githubOfficialLink: "",
    githubOfficialUser: "",
  });

  // Skills form/modal state
  const [showSkillModal, setShowSkillModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [skillForm, setSkillForm] = useState({
    name: "",
    category: "Frontend",
    proficiency: "80",
    icon: "FaReact",
  });

  // Experience form/modal state
  const [showExperienceModal, setShowExperienceModal] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [experienceForm, setExperienceForm] = useState({
    organization: "",
    title: "",
    duration: "",
    description: "",
    type: "experience",
    order: "0",
  });

  // Selected message state (for detailed viewing modal)
  const [selectedMessage, setSelectedMessage] = useState(null);

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const projectsData = await getProjects();
      const profileData = await getProfile();
      const skillsData = await getSkills();
      const experiencesData = await getExperiences();

      let messagesData = [];
      try {
        messagesData = await getMessages();
      } catch (err) {
        console.warn("Could not fetch messages:", err);
      }

      setProjects(projectsData);
      setProfile(profileData);
      setSkills(skillsData);
      setExperiences(experiencesData);
      setMessages(messagesData);

      // Populate profile form
      setProfileForm({
        name: profileData.name || "",
        typewriterStrings: profileData.typewriterStrings
          ? profileData.typewriterStrings.join(", ")
          : "",
        intro: profileData.intro || "",
        aboutParagraph1: profileData.aboutParagraph1 || "",
        aboutParagraph2: profileData.aboutParagraph2 || "",
        agencyName: profileData.agencyName || "",
        agencyLink: profileData.agencyLink || "",
        phone: profileData.phone || "",
        email: profileData.email || "",
        githubPersonalLink: profileData.githubPersonalLink || "",
        githubPersonalUser: profileData.githubPersonalUser || "",
        githubOfficialLink: profileData.githubOfficialLink || "",
        githubOfficialUser: profileData.githubOfficialUser || "",
      });
    } catch (error) {
      console.error("Error loading dashboard data:", error);
      showNotification("Error loading data from server", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login");
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Handle Project Form Changes
  const handleProjectFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setProjectForm((prev) => ({ ...prev, image: files[0] }));
    } else {
      setProjectForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Open Project Modal for Add
  const handleAddProjectClick = () => {
    setEditingProject(null);
    setProjectForm({
      title: "",
      subtitle: "",
      link: "",
      order: (projects.length + 1).toString(),
      tags: "",
      image: null,
      imageUrl: "",
    });
    setShowProjectModal(true);
  };

  // Open Project Modal for Edit
  const handleEditProjectClick = (project) => {
    setEditingProject(project);
    setProjectForm({
      title: project.title || "",
      subtitle: project.subtitle || "",
      link: project.link || "",
      order: (project.order || 0).toString(),
      tags: project.tags ? project.tags.join(", ") : "",
      image: null,
      imageUrl: project.image || "",
    });
    setShowProjectModal(true);
  };

  // Handle Project Submit
  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", projectForm.title);
    formData.append("subtitle", projectForm.subtitle);
    formData.append("link", projectForm.link);
    formData.append("order", projectForm.order);
    formData.append("tags", projectForm.tags);

    if (projectForm.image) {
      formData.append("image", projectForm.image);
    } else if (projectForm.imageUrl) {
      formData.append("image", projectForm.imageUrl);
    }

    try {
      if (editingProject) {
        await updateProject(editingProject._id, formData);
        showNotification("Project updated successfully!");
      } else {
        await createProject(formData);
        showNotification("Project created successfully!");
      }
      setShowProjectModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Failed to save project", "error");
    }
  };

  // Handle Project Delete
  const handleDeleteProject = async (id) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      try {
        await deleteProject(id);
        showNotification("Project deleted successfully!");
        fetchData();
      } catch (error) {
        showNotification(error.message || "Failed to delete project", "error");
      }
    }
  };

  // Handle Profile Form Change
  const handleProfileFormChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle Profile Submit
  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    // Parse typewriterStrings back into array
    const typewriterArray = profileForm.typewriterStrings
      .split(",")
      .map((str) => str.trim())
      .filter((str) => str.length > 0);

    const dataToSubmit = {
      ...profileForm,
      typewriterStrings: typewriterArray,
    };

    try {
      await updateProfile(dataToSubmit);
      showNotification("Profile settings updated successfully!");
      fetchData();
    } catch (error) {
      showNotification(error.message || "Failed to update profile", "error");
    }
  };

  // Handle Skill Form Changes
  const handleSkillFormChange = (e) => {
    const { name, value } = e.target;
    setSkillForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddSkillClick = () => {
    setEditingSkill(null);
    setSkillForm({
      name: "",
      category: "Frontend",
      proficiency: "80",
      icon: "FaReact",
    });
    setShowSkillModal(true);
  };

  const handleEditSkillClick = (skill) => {
    setEditingSkill(skill);
    setSkillForm({
      name: skill.name || "",
      category: skill.category || "Frontend",
      proficiency: (skill.proficiency || 80).toString(),
      icon: skill.icon || "FaReact",
    });
    setShowSkillModal(true);
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSkill) {
        await updateSkill(editingSkill._id, skillForm);
        showNotification("Skill updated successfully!");
      } else {
        await createSkill(skillForm);
        showNotification("Skill created successfully!");
      }
      setShowSkillModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Failed to save skill", "error");
    }
  };

  const handleDeleteSkill = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteSkill(id);
        showNotification("Skill deleted successfully!");
        fetchData();
      } catch (error) {
        showNotification(error.message || "Failed to delete skill", "error");
      }
    }
  };

  // Handle Experience Form Changes
  const handleExperienceFormChange = (e) => {
    const { name, value } = e.target;
    setExperienceForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddExperienceClick = () => {
    setEditingExperience(null);
    setExperienceForm({
      organization: "",
      title: "",
      duration: "",
      description: "",
      type: "experience",
      order: (experiences.length + 1).toString(),
    });
    setShowExperienceModal(true);
  };

  const handleEditExperienceClick = (exp) => {
    setEditingExperience(exp);
    setExperienceForm({
      organization: exp.organization || "",
      title: exp.title || "",
      duration: exp.duration || "",
      description: exp.description || "",
      type: exp.type || "experience",
      order: (exp.order || 0).toString(),
    });
    setShowExperienceModal(true);
  };

  const handleExperienceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingExperience) {
        await updateExperience(editingExperience._id, experienceForm);
        showNotification("Timeline entry updated successfully!");
      } else {
        await createExperience(experienceForm);
        showNotification("Timeline entry created successfully!");
      }
      setShowExperienceModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      showNotification(error.message || "Failed to save timeline entry", "error");
    }
  };

  const handleDeleteExperience = async (id) => {
    if (window.confirm("Are you sure you want to delete this timeline entry?")) {
      try {
        await deleteExperience(id);
        showNotification("Timeline entry deleted successfully!");
        fetchData();
      } catch (error) {
        showNotification(error.message || "Failed to delete timeline entry", "error");
      }
    }
  };

  // Messages handlers
  const handleToggleMessageRead = async (msg) => {
    try {
      await toggleMessageRead(msg._id, !msg.read);
      showNotification(`Message marked as ${!msg.read ? "read" : "unread"}!`);
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, read: !m.read } : m))
      );
    } catch (error) {
      showNotification("Failed to update message status", "error");
    }
  };

  const handleViewMessageDetails = async (msg) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      try {
        await toggleMessageRead(msg._id, true);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m))
        );
      } catch (error) {
        console.error("Failed to auto-mark message as read", error);
      }
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm("Are you sure you want to delete this message?")) {
      try {
        await deleteMessage(id);
        showNotification("Message deleted successfully!");
        setMessages((prev) => prev.filter((m) => m._id !== id));
      } catch (error) {
        showNotification("Failed to delete message", "error");
      }
    }
  };

  return (
    <div className="min-h-screen bg-[oklch(15%_0_0)] text-white font-sans selection:bg-primaryPest selection:text-black">
      {/* Top Header Navigation */}
      <header className="border-b border-primaryWhite600/10 bg-[oklch(17.76%_0_0)]/80 backdrop-blur sticky top-0 z-40 px-6 lg:px-12 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-primaryWhite600 hover:text-primaryPest transition-colors flex items-center gap-2 text-sm">
            <FaArrowLeft /> View Site
          </Link>
          <div className="h-4 w-[1px] bg-primaryWhite600/20"></div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-primaryPest bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
        </div>

        {/* Tab Controls & Logout */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-wrap bg-black/40 p-1 rounded-lg border border-primaryWhite600/10">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-3.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-300 ${
                activeTab === "projects"
                  ? "bg-primaryPest text-black shadow-md font-semibold"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-3.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-300 ${
                activeTab === "profile"
                  ? "bg-primaryPest text-black shadow-md font-semibold"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              Profile
            </button>
            <button
              onClick={() => setActiveTab("skills")}
              className={`px-3.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-300 ${
                activeTab === "skills"
                  ? "bg-primaryPest text-black shadow-md font-semibold"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              Skills
            </button>
            <button
              onClick={() => setActiveTab("journey")}
              className={`px-3.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-300 ${
                activeTab === "journey"
                  ? "bg-primaryPest text-black shadow-md font-semibold"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              Journey
            </button>
            <button
              onClick={() => setActiveTab("messages")}
              className={`px-3.5 py-1.5 rounded-md text-xs lg:text-sm font-medium transition-all duration-300 flex items-center gap-1.5 ${
                activeTab === "messages"
                  ? "bg-primaryPest text-black shadow-md font-semibold"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              Inbox
              {messages.filter((m) => !m.read).length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-primaryPest text-black animate-pulse">
                  {messages.filter((m) => !m.read).length}
                </span>
              )}
            </button>
          </div>
          <button
            onClick={handleLogout}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-red-950/20 text-red-400 border border-red-500/20 hover:bg-red-500/20 hover:text-white transition-all duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Notifications banner */}
      {notification && (
        <div
          className={`fixed top-20 right-6 z-[9999] px-6 py-3 rounded-lg shadow-lg border backdrop-blur transition-all duration-500 transform translate-y-0 ${
            notification.type === "error"
              ? "bg-red-950/80 border-red-500/50 text-red-200"
              : "bg-emerald-950/80 border-emerald-500/50 text-emerald-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 lg:px-12 py-10">
        {loading ? (
          <div className="flex flex-col gap-4 justify-center items-center py-32">
            <div className="w-12 h-12 rounded-full border-2 border-primaryPest/20 border-t-primaryPest animate-spin"></div>
            <p className="text-primaryWhite600 text-sm animate-pulse">Syncing portfolio data...</p>
          </div>
        ) : activeTab === "projects" ? (
          /* ================= PROJECTS TAB ================= */
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold">Manage Projects</h2>
                <p className="text-primaryWhite600 text-sm mt-1">
                  Add, edit, or delete projects showing on your portfolio main page.
                </p>
              </div>
              <button
                onClick={handleAddProjectClick}
                className="flex items-center gap-2 bg-primaryPest hover:bg-primaryPest/80 text-black px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-primaryPest/10"
              >
                <FaPlus size={14} /> Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <div className="border border-dashed border-primaryWhite600/20 rounded-xl p-12 text-center">
                <p className="text-primaryWhite600 mb-4">No projects found. Add your first project!</p>
                <button
                  onClick={handleAddProjectClick}
                  className="bg-primaryPest/15 border border-primaryPest/30 text-primaryPest hover:bg-primaryPest/20 px-6 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Create New Project
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project) => (
                  <div
                    key={project._id}
                    className="group bg-[oklch(17.76%_0_0)] border border-primaryWhite600/10 rounded-xl overflow-hidden shadow-lg hover:shadow-primaryPest/5 hover:border-primaryPest/30 transition-all duration-300 flex flex-col"
                  >
                    {/* Image preview */}
                    <div className="h-48 overflow-hidden bg-black/60 relative">
                      <img
                        src={getImageUrl(project.image)}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.target.src = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600";
                        }}
                      />
                      <div className="absolute top-2 right-2 bg-black/75 backdrop-blur px-2.5 py-1 rounded text-xs text-primaryWhite600">
                        Order: {project.order || 0}
                      </div>
                    </div>

                    {/* Project info */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div className="space-y-3">
                        <h3 className="text-lg font-semibold truncate group-hover:text-primaryPest transition-colors duration-300">
                          {project.title}
                        </h3>
                        {project.tags && project.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.tags.map((tag) => (
                              <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded bg-primaryPest/10 text-primaryPest border border-primaryPest/20 uppercase tracking-widest">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <p className="text-primaryWhite600 text-xs mt-2 line-clamp-3 leading-relaxed">
                          {project.subtitle}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-primaryWhite600/5 flex justify-between items-center gap-3">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-primaryWhite600 hover:text-primaryPest transition-colors flex items-center gap-1.5"
                        >
                          <FaGlobe size={11} /> Link
                        </a>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEditProjectClick(project)}
                            className="bg-primaryWhite600/10 hover:bg-primaryPest/20 hover:text-primaryPest p-2 rounded text-primaryWhite600 transition-colors"
                            title="Edit"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project._id)}
                            className="bg-primaryWhite600/10 hover:bg-red-500/20 hover:text-red-400 p-2 rounded text-primaryWhite600 transition-colors"
                            title="Delete"
                          >
                            <FaTrash size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : activeTab === "profile" ? (
          /* ================= PROFILE TAB ================= */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">Change Portfolio Content</h2>
              <p className="text-primaryWhite600 text-sm mt-1">
                Customize titles, agency details, contact information, and descriptions on your website.
              </p>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-8">
              {/* Box 1: General Info */}
              <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/10 rounded-xl p-6 lg:p-8 space-y-6">
                <h3 className="text-lg font-medium text-primaryPest border-b border-primaryWhite600/10 pb-3">
                  Hero Title & General Info
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={profileForm.name}
                      onChange={handleProfileFormChange}
                      required
                      placeholder="e.g. Al Nahian Rafi"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Hero Intro Greeting
                    </label>
                    <input
                      type="text"
                      name="intro"
                      value={profileForm.intro}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. Hi there"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                    Typewriter Roles (Comma Separated)
                  </label>
                  <input
                    type="text"
                    name="typewriterStrings"
                    value={profileForm.typewriterStrings}
                    onChange={handleProfileFormChange}
                    placeholder="Developer., React Developer., Front-End Developer."
                    className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                  />
                  <p className="text-[11px] text-primaryWhite600 italic">
                    Separate each typewriter animated string with a comma.
                  </p>
                </div>
              </div>

              {/* Box 2: About / Agency details */}
              <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/10 rounded-xl p-6 lg:p-8 space-y-6">
                <h3 className="text-lg font-medium text-primaryPest border-b border-primaryWhite600/10 pb-3">
                  About Me Paragraphs & Agency
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Agency Name
                    </label>
                    <input
                      type="text"
                      name="agencyName"
                      value={profileForm.agencyName}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. Softvence Digital Agency"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Agency Website URL
                    </label>
                    <input
                      type="url"
                      name="agencyLink"
                      value={profileForm.agencyLink}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. https://softvence.agency/"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                    Bio Paragraph 1
                  </label>
                  <textarea
                    name="aboutParagraph1"
                    value={profileForm.aboutParagraph1}
                    onChange={handleProfileFormChange}
                    rows={4}
                    placeholder="First section of about text..."
                    className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg p-4 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                    Bio Paragraph 2
                  </label>
                  <textarea
                    name="aboutParagraph2"
                    value={profileForm.aboutParagraph2}
                    onChange={handleProfileFormChange}
                    rows={4}
                    placeholder="Second section of about text..."
                    className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg p-4 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                  />
                </div>
              </div>

              {/* Box 3: Contact & Links */}
              <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/10 rounded-xl p-6 lg:p-8 space-y-6">
                <h3 className="text-lg font-medium text-primaryPest border-b border-primaryWhite600/10 pb-3">
                  Reach Me Details & Git Links
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={profileForm.phone}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. +8801761186858"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={profileForm.email}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. Alrafi321@icloud.com"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Github Personal URL
                    </label>
                    <input
                      type="url"
                      name="githubPersonalLink"
                      value={profileForm.githubPersonalLink}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. https://github.com/dev-nahianrafi"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Github Personal Username
                    </label>
                    <input
                      type="text"
                      name="githubPersonalUser"
                      value={profileForm.githubPersonalUser}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. dev-nahianrafi"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Github Official URL
                    </label>
                    <input
                      type="url"
                      name="githubOfficialLink"
                      value={profileForm.githubOfficialLink}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. https://github.com/dev-Nahian"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                      Github Official Username
                    </label>
                    <input
                      type="text"
                      name="githubOfficialUser"
                      value={profileForm.githubOfficialUser}
                      onChange={handleProfileFormChange}
                      placeholder="e.g. dev-Nahian"
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Profile changes */}
              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  className="flex items-center gap-2 bg-primaryPest hover:bg-primaryPest/80 text-black px-6 py-3 rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-primaryPest/10"
                >
                  <FaSave /> Save Profile Settings
                </button>
              </div>
            </form>
          </div>
        ) : activeTab === "skills" ? (
          /* ================= SKILLS TAB ================= */
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold">Manage Skills</h2>
                <p className="text-primaryWhite600 text-sm mt-1">
                  Add, edit, or delete items inside your skills matrix.
                </p>
              </div>
              <button
                onClick={handleAddSkillClick}
                className="flex items-center gap-2 bg-primaryPest hover:bg-primaryPest/80 text-black px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-primaryPest/10"
              >
                <FaPlus size={14} /> Add Skill
              </button>
            </div>

            {skills.length === 0 ? (
              <div className="border border-dashed border-primaryWhite600/20 rounded-xl p-12 text-center">
                <p className="text-primaryWhite600 mb-4">No skills found. Add your first skill!</p>
                <button
                  onClick={handleAddSkillClick}
                  className="bg-primaryPest/15 border border-primaryPest/30 text-primaryPest hover:bg-primaryPest/20 px-6 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Create New Skill
                </button>
              </div>
            ) : (
              <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/10 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-primaryWhite600/10 bg-black/20 text-primaryWhite600 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-4 px-6">Skill Name</th>
                        <th className="py-4 px-6">Category</th>
                        <th className="py-4 px-6">Proficiency</th>
                        <th className="py-4 px-6">Icon Name</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primaryWhite600/5">
                      {skills.map((skill) => (
                        <tr key={skill._id} className="hover:bg-white/5 transition-colors">
                          <td className="py-4 px-6 font-medium text-white">{skill.name}</td>
                          <td className="py-4 px-6 text-primaryWhite600">{skill.category}</td>
                          <td className="py-4 px-6">
                            <div className="flex items-center gap-3">
                              <span className="w-8 font-semibold text-primaryPest">{skill.proficiency}%</span>
                              <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                <div className="h-full bg-primaryPest rounded-full" style={{ width: `${skill.proficiency}%` }}></div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-mono text-xs text-primaryWhite600">{skill.icon}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleEditSkillClick(skill)}
                                className="bg-primaryWhite600/10 hover:bg-primaryPest/20 hover:text-primaryPest p-2 rounded text-primaryWhite600 transition-colors"
                              >
                                <FaEdit size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteSkill(skill._id)}
                                className="bg-primaryWhite600/10 hover:bg-red-500/20 hover:text-red-400 p-2 rounded text-primaryWhite600 transition-colors"
                              >
                                <FaTrash size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : activeTab === "journey" ? (
          /* ================= JOURNEY TIMELINE TAB ================= */
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h2 className="text-2xl font-semibold">Manage Journey Timeline</h2>
                <p className="text-primaryWhite600 text-sm mt-1">
                  Add, edit, or delete experiences and educational events.
                </p>
              </div>
              <button
                onClick={handleAddExperienceClick}
                className="flex items-center gap-2 bg-primaryPest hover:bg-primaryPest/80 text-black px-5 py-2.5 rounded-lg font-medium transition-all duration-300 shadow-lg shadow-primaryPest/10"
              >
                <FaPlus size={14} /> Add Event
              </button>
            </div>

            {experiences.length === 0 ? (
              <div className="border border-dashed border-primaryWhite600/20 rounded-xl p-12 text-center">
                <p className="text-primaryWhite600 mb-4">No events found. Add your first timeline event!</p>
                <button
                  onClick={handleAddExperienceClick}
                  className="bg-primaryPest/15 border border-primaryPest/30 text-primaryPest hover:bg-primaryPest/20 px-6 py-2 rounded-lg text-sm font-medium transition-all"
                >
                  Create New Event
                </button>
              </div>
            ) : (
              <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/10 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-primaryWhite600/10 bg-black/20 text-primaryWhite600 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-4 px-6">Organization</th>
                        <th className="py-4 px-6">Title</th>
                        <th className="py-4 px-6">Duration</th>
                        <th className="py-4 px-6">Type</th>
                        <th className="py-4 px-6">Order</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primaryWhite600/5">
                      {experiences
                        .sort((a, b) => a.order - b.order)
                        .map((exp) => (
                          <tr key={exp._id} className="hover:bg-white/5 transition-colors">
                            <td className="py-4 px-6 font-medium text-white">{exp.organization}</td>
                            <td className="py-4 px-6 text-primaryWhite600">{exp.title}</td>
                            <td className="py-4 px-6 text-primaryWhite600">{exp.duration}</td>
                            <td className="py-4 px-6">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                  exp.type === "experience"
                                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                    : "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                }`}
                              >
                                {exp.type}
                              </span>
                            </td>
                            <td className="py-4 px-6 text-primaryWhite600 font-mono">{exp.order || 0}</td>
                            <td className="py-4 px-6 text-right">
                              <div className="flex justify-end gap-2">
                                <button
                                  onClick={() => handleEditExperienceClick(exp)}
                                  className="bg-primaryWhite600/10 hover:bg-primaryPest/20 hover:text-primaryPest p-2 rounded text-primaryWhite600 transition-colors"
                                >
                                  <FaEdit size={13} />
                                </button>
                                <button
                                  onClick={() => handleDeleteExperience(exp._id)}
                                  className="bg-primaryWhite600/10 hover:bg-red-500/20 hover:text-red-400 p-2 rounded text-primaryWhite600 transition-colors"
                                >
                                  <FaTrash size={13} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ================= MESSAGES INBOX TAB ================= */
          <div>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold">Contact Messages Inbox</h2>
              <p className="text-primaryWhite600 text-sm mt-1">
                View, read, and manage client messages sent through the Contact Form.
              </p>
            </div>

            {messages.length === 0 ? (
              <div className="border border-dashed border-primaryWhite600/20 rounded-xl p-12 text-center text-primaryWhite600">
                Inbox is empty. No messages received yet.
              </div>
            ) : (
              <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/10 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-primaryWhite600/10 bg-black/20 text-primaryWhite600 font-semibold uppercase tracking-wider text-[11px]">
                        <th className="py-4 px-6 w-16">Status</th>
                        <th className="py-4 px-6">Sender</th>
                        <th className="py-4 px-6">Message Snippet</th>
                        <th className="py-4 px-6 w-32">Date</th>
                        <th className="py-4 px-6 text-right w-40">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-primaryWhite600/5">
                      {messages.map((msg) => (
                        <tr key={msg._id} className={`transition-colors ${!msg.read ? "bg-primaryPest/5 hover:bg-primaryPest/10 font-medium" : "hover:bg-white/5"}`}>
                          <td className="py-4 px-6">
                            <button
                              onClick={() => handleToggleMessageRead(msg)}
                              className={`p-1.5 rounded-full transition-colors ${
                                !msg.read
                                  ? "text-primaryPest hover:bg-primaryPest/20"
                                  : "text-primaryWhite600 hover:bg-white/10"
                              }`}
                              title={!msg.read ? "Mark as Read" : "Mark as Unread"}
                            >
                              {!msg.read ? <FaEnvelope size={15} /> : <FaEnvelopeOpen size={15} />}
                            </button>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex flex-col">
                              <span className="text-white font-medium">{msg.name}</span>
                              <span className="text-xs text-primaryWhite600 font-mono mt-0.5">{msg.email}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 max-w-xs truncate text-primaryWhite600">{msg.message}</td>
                          <td className="py-4 px-6 text-primaryWhite600 text-xs font-mono">
                            {new Date(msg.createdAt).toLocaleDateString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button
                                onClick={() => handleViewMessageDetails(msg)}
                                className="bg-primaryWhite600/10 hover:bg-primaryPest/20 hover:text-primaryPest px-3 py-1.5 rounded text-xs text-primaryWhite600 transition-colors flex items-center gap-1"
                                title="View Details"
                              >
                                <FaEye size={12} /> View
                              </button>
                              <button
                                onClick={() => handleDeleteMessage(msg._id)}
                                className="bg-primaryWhite600/10 hover:bg-red-500/20 hover:text-red-400 p-2 rounded text-primaryWhite600 transition-colors"
                                title="Delete"
                              >
                                <FaTrash size={12} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ================= ADD/EDIT PROJECT MODAL ================= */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/20 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-5 border-b border-primaryWhite600/10 flex justify-between items-center bg-black/20">
              <h3 className="text-lg font-bold">
                {editingProject ? "Edit Project Details" : "Add New Project"}
              </h3>
              <button
                onClick={() => setShowProjectModal(false)}
                className="text-primaryWhite600 hover:text-white transition-colors text-xl font-medium"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleProjectSubmit} className="flex-grow overflow-y-auto p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Project Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={projectForm.title}
                  onChange={handleProjectFormChange}
                  required
                  placeholder="e.g. Clone of Disney+"
                  className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Description / Subtitle
                </label>
                <textarea
                  name="subtitle"
                  value={projectForm.subtitle}
                  onChange={handleProjectFormChange}
                  required
                  rows={3}
                  placeholder="Tell people about this project, stack used, features, etc..."
                  className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg p-4 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Tags / Tech Stack (Comma Separated)
                </label>
                <input
                  type="text"
                  name="tags"
                  value={projectForm.tags}
                  onChange={handleProjectFormChange}
                  placeholder="e.g. React, Tailwind CSS, Node.js"
                  className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                    View Project URL (Live Link)
                  </label>
                  <input
                    type="url"
                    name="link"
                    value={projectForm.link}
                    onChange={handleProjectFormChange}
                    required
                    placeholder="https://..."
                    className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                    Sorting Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={projectForm.order}
                    onChange={handleProjectFormChange}
                    placeholder="0"
                    className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Project Image Cover
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Upload Option */}
                  <div className="border border-dashed border-primaryWhite600/20 hover:border-primaryPest/50 rounded-xl p-4 bg-black/20 flex flex-col justify-center items-center transition-colors">
                    <p className="text-xs text-primaryWhite600 mb-2 font-medium">Upload File</p>
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleProjectFormChange}
                      className="text-xs w-full text-primaryWhite600 file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-primaryPest/20 file:text-primaryPest hover:file:bg-primaryPest/30 file:cursor-pointer"
                    />
                    <p className="text-[10px] text-primaryWhite600/60 mt-1">PNG, JPG, WEBP, GIF up to 5MB</p>
                  </div>

                  {/* Or Direct Image URL */}
                  <div className="border border-primaryWhite600/10 rounded-xl p-4 bg-black/20 flex flex-col justify-center space-y-2">
                    <p className="text-xs text-primaryWhite600 font-medium">Or Paste Image URL / Existing Path</p>
                    <input
                      type="text"
                      name="imageUrl"
                      value={projectForm.imageUrl}
                      onChange={handleProjectFormChange}
                      placeholder="/src/assets/... or https://..."
                      className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-primaryPest transition-colors duration-300"
                    />
                  </div>
                </div>

                {projectForm.image && (
                  <p className="text-xs text-primaryPest">
                    Selected file: <span className="font-semibold">{projectForm.image.name}</span>
                  </p>
                )}

                {/* Show Preview */}
                {(projectForm.imageUrl || projectForm.image) && (
                  <div className="mt-4 pt-3 border-t border-primaryWhite600/10">
                    <p className="text-[11px] font-semibold text-primaryWhite600 uppercase mb-2">Image Preview</p>
                    <div className="h-40 max-w-sm rounded-lg overflow-hidden border border-primaryWhite600/15">
                      <img
                        src={projectForm.image ? URL.createObjectURL(projectForm.image) : getImageUrl(projectForm.imageUrl)}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Submit project */}
              <div className="pt-4 border-t border-primaryWhite600/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 border border-primaryWhite600/20 rounded-lg text-sm text-primaryWhite600 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primaryPest hover:bg-primaryPest/80 text-black px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
                >
                  {editingProject ? "Update Project" : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD/EDIT SKILL MODAL ================= */}
      {showSkillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/20 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-primaryWhite600/10 flex justify-between items-center bg-black/20">
              <h3 className="text-lg font-bold">
                {editingSkill ? "Edit Skill Details" : "Add New Skill"}
              </h3>
              <button
                onClick={() => setShowSkillModal(false)}
                className="text-primaryWhite600 hover:text-white transition-colors text-xl font-medium"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSkillSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Skill Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={skillForm.name}
                  onChange={handleSkillFormChange}
                  required
                  placeholder="e.g. React"
                  className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Category
                </label>
                <select
                  name="category"
                  value={skillForm.category}
                  onChange={handleSkillFormChange}
                  className="w-full bg-black border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                >
                  <option value="Frontend">Frontend</option>
                  <option value="Backend">Backend</option>
                  <option value="Tools & Design">Tools & Design</option>
                </select>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-primaryWhite600 uppercase tracking-wider mb-1">
                  <span>Proficiency Level</span>
                  <span className="text-primaryPest font-mono text-sm">{skillForm.proficiency}%</span>
                </div>
                <input
                  type="range"
                  name="proficiency"
                  min="0"
                  max="100"
                  value={skillForm.proficiency}
                  onChange={handleSkillFormChange}
                  className="w-full accent-primaryPest"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  React Icon Component Name
                </label>
                <input
                  type="text"
                  name="icon"
                  value={skillForm.icon}
                  onChange={handleSkillFormChange}
                  required
                  placeholder="e.g. FaReact or RiTailwindCssFill"
                  className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                />
                <p className="text-[10px] text-primaryWhite600 italic">
                  Provide a valid icon name from React Icons package (e.g. FaReact, FaJsSquare, RiTailwindCssFill, SiRedux, FaHtml5).
                </p>
              </div>

              <div className="pt-4 border-t border-primaryWhite600/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSkillModal(false)}
                  className="px-4 py-2 border border-primaryWhite600/20 rounded-lg text-sm text-primaryWhite600 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primaryPest hover:bg-primaryPest/80 text-black px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
                >
                  {editingSkill ? "Update Skill" : "Create Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= ADD/EDIT EXPERIENCE TIMELINE MODAL ================= */}
      {showExperienceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/20 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-primaryWhite600/10 flex justify-between items-center bg-black/20">
              <h3 className="text-lg font-bold">
                {editingExperience ? "Edit Timeline Event" : "Add Timeline Event"}
              </h3>
              <button
                onClick={() => setShowExperienceModal(false)}
                className="text-primaryWhite600 hover:text-white transition-colors text-xl font-medium"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleExperienceSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Organization / University Name
                </label>
                <input
                  type="text"
                  name="organization"
                  value={experienceForm.organization}
                  onChange={handleExperienceFormChange}
                  required
                  placeholder="e.g. Softvence Digital Agency"
                  className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Title / Role / Degree
                </label>
                <input
                  type="text"
                  name="title"
                  value={experienceForm.title}
                  onChange={handleExperienceFormChange}
                  required
                  placeholder="e.g. Jr. Frontend Developer"
                  className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                    Duration Period
                  </label>
                  <input
                    type="text"
                    name="duration"
                    value={experienceForm.duration}
                    onChange={handleExperienceFormChange}
                    required
                    placeholder="e.g. 2023 - Present"
                    className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                    Sorting Order
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={experienceForm.order}
                    onChange={handleExperienceFormChange}
                    required
                    placeholder="e.g. 1"
                    className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg px-4 py-2.5 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Timeline Event Type
                </label>
                <div className="flex gap-4 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="experience"
                      checked={experienceForm.type === "experience"}
                      onChange={handleExperienceFormChange}
                      className="accent-primaryPest"
                    />
                    <span className="text-sm">Work Experience</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="type"
                      value="education"
                      checked={experienceForm.type === "education"}
                      onChange={handleExperienceFormChange}
                      className="accent-primaryPest"
                    />
                    <span className="text-sm">Education</span>
                  </label>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-primaryWhite600 uppercase tracking-wider block">
                  Description / Responsibilities
                </label>
                <textarea
                  name="description"
                  value={experienceForm.description}
                  onChange={handleExperienceFormChange}
                  required
                  rows={4}
                  placeholder="Summarize your main responsibilities, skills developed, honors earned, etc..."
                  className="w-full bg-black/40 border border-primaryWhite600/20 rounded-lg p-4 text-white outline-none focus:border-primaryPest transition-colors duration-300"
                />
              </div>

              <div className="pt-4 border-t border-primaryWhite600/10 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowExperienceModal(false)}
                  className="px-4 py-2 border border-primaryWhite600/20 rounded-lg text-sm text-primaryWhite600 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primaryPest hover:bg-primaryPest/80 text-black px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg"
                >
                  {editingExperience ? "Update Event" : "Create Event"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= VIEW MESSAGE DETAILS MODAL ================= */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
          <div className="bg-[oklch(17.76%_0_0)] border border-primaryWhite600/20 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-primaryWhite600/10 flex justify-between items-center bg-black/20">
              <h3 className="text-lg font-bold">Message Details</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="text-primaryWhite600 hover:text-white transition-colors text-xl font-medium"
              >
                &times;
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-black/20 p-4 border border-primaryWhite600/5 rounded-xl text-sm">
                <div>
                  <p className="text-[10px] uppercase font-bold text-primaryWhite600 tracking-wider">From Name</p>
                  <p className="text-white font-medium mt-0.5">{selectedMessage.name}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-primaryWhite600 tracking-wider">Email Address</p>
                  <p className="text-primaryPest font-mono mt-0.5">{selectedMessage.email}</p>
                </div>
                <div className="md:col-span-2 pt-2 border-t border-primaryWhite600/5">
                  <p className="text-[10px] uppercase font-bold text-primaryWhite600 tracking-wider">Date Sent</p>
                  <p className="text-white mt-0.5">
                    {new Date(selectedMessage.createdAt).toLocaleString(undefined, {
                      dateStyle: "full",
                      timeStyle: "short",
                    })}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-xs uppercase font-bold text-primaryWhite600 tracking-wider">Message Content</p>
                <div className="bg-black/30 border border-primaryWhite600/10 rounded-xl p-5 text-sm leading-relaxed text-white/90 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-primaryWhite600/10 pt-4">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Regarding your message from Rafi's Portfolio`}
                  className="bg-primaryPest hover:bg-primaryPest/80 text-black px-5 py-2 rounded-md text-xs font-semibold shadow transition-colors"
                >
                  Reply Email
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedMessage(null)}
                  className="px-4 py-2 border border-primaryWhite600/20 rounded-md text-xs text-primaryWhite600 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
