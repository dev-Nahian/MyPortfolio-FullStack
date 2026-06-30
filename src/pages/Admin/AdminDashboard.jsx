import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSave, FaArrowLeft, FaGlobe, FaEye } from "react-icons/fa";
import { getProjects, createProject, updateProject, deleteProject, getProfile, updateProfile, getImageUrl } from "../../shared/api";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("projects");
  const [projects, setProjects] = useState([]);
  const [profile, setProfile] = useState({});
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
    image: null,
    imageUrl: "", // For textual url fallback
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

  // Fetch initial data
  const fetchData = async () => {
    setLoading(true);
    try {
      const projectsData = await getProjects();
      const profileData = await getProfile();
      setProjects(projectsData);
      setProfile(profileData);

      // Populate profile form
      setProfileForm({
        name: profileData.name || "",
        typewriterStrings: profileData.typewriterStrings ? profileData.typewriterStrings.join(", ") : "",
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



  return (
    <div className="min-h-screen bg-[oklch(15%_0_0)] text-white font-sans selection:bg-primaryPest selection:text-black">
      {/* Top Header Navigation */}
      <header className="border-b border-primaryWhite600/10 bg-[oklch(17.76%_0_0)]/80 backdrop-blur sticky top-0 z-40 px-6 lg:px-12 py-4 flex items-center justify-between">
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
        <div className="flex items-center gap-4">
          <div className="flex bg-black/40 p-1 rounded-lg border border-primaryWhite600/10">
            <button
              onClick={() => setActiveTab("projects")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === "projects"
                  ? "bg-primaryPest text-black shadow-md"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              Projects
            </button>
            <button
              onClick={() => setActiveTab("profile")}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-300 ${
                activeTab === "profile"
                  ? "bg-primaryPest text-black shadow-md"
                  : "text-primaryWhite600 hover:text-white"
              }`}
            >
              Profile Content
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
                      <div>
                        <h3 className="text-lg font-semibold truncate group-hover:text-primaryPest transition-colors duration-300">
                          {project.title}
                        </h3>
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
        ) : (
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
        )}
      </main>

      {/* ================= ADD/EDIT PROJECT MODAL ================= */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
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
    </div>
  );
};

export default AdminDashboard;
