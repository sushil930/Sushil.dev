import React, { useState, useEffect, useRef } from 'react';
import { 
  LayoutDashboard, 
  FolderKanban, 
  Wrench, 
  LogOut, 
  Plus, 
  Save, 
  X, 
  Trash2, 
  Edit2, 
  Image, 
  Upload, 
  Loader2,
  Github,
  ExternalLink,
  ChevronRight,
  Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { 
  getProjects, 
  addProject, 
  updateProject, 
  deleteProject, 
  getSkills, 
  addSkill, 
  updateSkill, 
  deleteSkill 
} from '../utils/dataManager';
import { uploadImageToCloudinary } from '../utils/cloudinary';
import { Project } from '../types';
import { SkillData } from '../utils/dataManager';

// Minimal Card Component
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-slate-900 border border-slate-800 rounded-xl ${className}`}>
    {children}
  </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'skills'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingSkill, setEditingSkill] = useState<SkillData | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Initial states for new items
  const initialProject: Project = {
    id: 0,
    title: '',
    description: '',
    longDescription: '',
    image: '',
    screenshots: [],
    tech: [],
    features: [],
    challenges: '',
    codeLink: '',
    liveLink: '',
    status: 'In Progress'
  };

  const initialSkill: SkillData = {
    name: '',
    icon: '',
    level: 50,
    color: 'text-slate-400',
    barColor: 'to-slate-400',
    category: 'Frontend'
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [projectsData, skillsData] = await Promise.all([
        getProjects(),
        getSkills()
      ]);
      setProjects(projectsData);
      setSkills(skillsData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const handleDeleteProject = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      await deleteProject(id);
      fetchData();
    }
  };

  const handleDeleteSkill = async (name: string) => {
    if (window.confirm('Are you sure you want to delete this skill?')) {
      await deleteSkill(name);
      fetchData();
    }
  };

  const handleSaveProject = async (project: Project) => {
    if (project.id === 0) {
      await addProject({ ...project, id: Date.now() });
    } else {
      await updateProject(project.id, project);
    }
    setEditingProject(null);
    setIsAddingNew(false);
    fetchData();
  };

  const handleSaveSkill = async (skill: SkillData) => {
    if (editingSkill) {
      await updateSkill(editingSkill.name, skill);
    } else {
      await addSkill(skill);
    }
    setEditingSkill(null);
    setIsAddingNew(false);
    fetchData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex font-sans">
      {/* Minimal Sidebar */}
      <aside className="w-64 border-r border-slate-800 bg-slate-950 flex flex-col fixed h-full z-10">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white tracking-tight">Admin<span className="text-indigo-500">Panel</span></h1>
          <p className="text-xs text-slate-500 mt-1">v2.0.0 Minimal</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <button
            onClick={() => { setActiveTab('projects'); setEditingProject(null); setIsAddingNew(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'projects' 
                ? 'bg-indigo-500/10 text-indigo-400' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <FolderKanban size={18} />
            Projects
          </button>
          <button
            onClick={() => { setActiveTab('skills'); setEditingSkill(null); setIsAddingNew(false); }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'skills' 
                ? 'bg-indigo-500/10 text-indigo-400' 
                : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
            }`}
          >
            <Wrench size={18} />
            Skills
          </button>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {activeTab === 'projects' ? 'Projects' : 'Skills'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Manage your portfolio content</p>
          </div>
          
          {!editingProject && !editingSkill && !isAddingNew && (
            <button
              onClick={() => setIsAddingNew(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-lg shadow-indigo-900/20"
            >
              <Plus size={18} />
              Add New
            </button>
          )}
        </header>

        {/* Content Area */}
        <div className="max-w-6xl">
          {(editingProject || (isAddingNew && activeTab === 'projects')) ? (
            <ProjectForm
              project={editingProject || initialProject}
              onSave={handleSaveProject}
              onCancel={() => { setEditingProject(null); setIsAddingNew(false); }}
            />
          ) : (editingSkill || (isAddingNew && activeTab === 'skills')) ? (
            <SkillForm
              skill={editingSkill || initialSkill}
              onSave={handleSaveSkill}
              onCancel={() => { setEditingSkill(null); setIsAddingNew(false); }}
              isEditing={!!editingSkill}
            />
          ) : (
            <>
              {activeTab === 'projects' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="group hover:border-indigo-500/50 transition-colors">
                      <div className="aspect-video w-full overflow-hidden rounded-t-xl bg-slate-950 relative">
                        {project.image ? (
                          <img 
                            src={project.image} 
                            alt={project.title} 
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-700">
                            <Image size={32} />
                          </div>
                        )}
                        <div className="absolute top-2 right-2 px-2 py-1 bg-slate-950/80 backdrop-blur-sm rounded text-xs font-medium text-white border border-slate-800">
                          {project.status}
                        </div>
                      </div>
                      
                      <div className="p-5">
                        <h3 className="text-lg font-semibold text-white mb-2">{project.title}</h3>
                        <p className="text-slate-400 text-sm line-clamp-2 mb-4 h-10">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                          <div className="flex gap-2">
                            {project.codeLink && <Github size={16} className="text-slate-500" />}
                            {project.liveLink && <ExternalLink size={16} className="text-slate-500" />}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingProject(project)}
                              className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDeleteProject(project.id!)}
                              className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {skills.map((skill) => (
                    <Card key={skill.name} className="p-5 hover:border-indigo-500/50 transition-colors flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-slate-800 rounded-lg">
                            <span className="iconify text-2xl text-slate-200" data-icon={skill.icon}></span>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingSkill(skill)}
                              className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-colors"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => handleDeleteSkill(skill.name)}
                              className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-lg font-semibold text-white mb-1">{skill.name}</h3>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{skill.category}</p>
                      </div>

                      <div className="mt-4">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="text-slate-400">Proficiency</span>
                          <span className="text-white font-medium">{skill.level}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

// Image Uploader Component
const ImageUploader: React.FC<{
  currentImage: string;
  onImageUploaded: (url: string) => void;
  label: string;
}> = ({ currentImage, onImageUploaded, label }) => {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadToCloudinary = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const data = await uploadImageToCloudinary(file, 'portfolio/projects');
      if (data.success && data.data) {
        onImageUploaded(data.data.optimizedUrl);
      } else {
        setError('Upload failed. Please try again.');
      }
    } catch (err) {
      setError('Error uploading image.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) uploadToCloudinary(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) uploadToCloudinary(file);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-300">{label}</label>
      
      {currentImage && (
        <div className="relative group rounded-lg overflow-hidden border border-slate-700">
          <img 
            src={currentImage} 
            alt="Preview" 
            className="w-full h-48 object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-slate-900 rounded-lg font-medium text-sm hover:bg-slate-100 transition-colors"
            >
              Change Image
            </button>
          </div>
        </div>
      )}

      <div
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onClick={() => fileInputRef.current?.click()}
        className={`
          relative border border-dashed rounded-lg p-8 text-center cursor-pointer transition-all
          ${dragOver ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-700 hover:border-slate-500 hover:bg-slate-900'}
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="text-slate-400 text-sm">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload className="w-6 h-6 text-slate-500" />
            <span className="text-slate-400 text-sm">
              Drop image here or click to upload
            </span>
          </div>
        )}
      </div>

      {error && <p className="text-red-400 text-xs">{error}</p>}

      <input
        type="text"
        value={currentImage}
        onChange={(e) => onImageUploaded(e.target.value)}
        placeholder="Or paste image URL..."
        className="w-full px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-slate-200 text-sm focus:border-indigo-500 focus:outline-none transition-colors"
      />
    </div>
  );
};

// Project Form Component
const ProjectForm: React.FC<{
  project: Project;
  onSave: (project: Project) => void;
  onCancel: () => void;
}> = ({ project, onSave, onCancel }) => {
  const [formData, setFormData] = useState(project);
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const screenshotInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedData = {
      ...formData,
      features: (formData.features || []).filter(f => f.trim())
    };
    onSave(cleanedData);
  };

  const uploadScreenshot = async (file: File) => {
    setScreenshotUploading(true);
    try {
      const data = await uploadImageToCloudinary(file, 'portfolio/screenshots');
      if (data.success && data.data) {
        setFormData({
          ...formData,
          screenshots: [...(formData.screenshots || []), data.data.optimizedUrl],
        });
      }
    } catch (err) {
      console.error('Screenshot upload failed:', err);
    } finally {
      setScreenshotUploading(false);
    }
  };

  const removeScreenshot = (index: number) => {
    const updated = [...(formData.screenshots || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, screenshots: updated });
  };

  return (
    <Card className="p-8">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <h3 className="text-xl font-semibold text-white">
            {project.id ? 'Edit Project' : 'New Project'}
          </h3>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
              >
                <option value="Completed">Completed</option>
                <option value="In Progress">In Progress</option>
                <option value="Planned">Planned</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Short Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">GitHub URL</label>
                <input
                  type="text"
                  value={formData.codeLink}
                  onChange={(e) => setFormData({ ...formData, codeLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Live URL</label>
                <input
                  type="text"
                  value={formData.liveLink}
                  onChange={(e) => setFormData({ ...formData, liveLink: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <ImageUploader
              currentImage={formData.image}
              onImageUploaded={(url) => setFormData({ ...formData, image: url })}
              label="Project Thumbnail"
            />

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Tech Stack</label>
              <input
                type="text"
                value={formData.tech.join(', ')}
                onChange={(e) => setFormData({ ...formData, tech: e.target.value.split(',').map(t => t.trim()) })}
                placeholder="React, TypeScript, Tailwind..."
                className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Detailed Description</label>
            <textarea
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
              rows={5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Features (one per line)</label>
            <textarea
              value={(formData.features || []).join('\n')}
              onChange={(e) => setFormData({ ...formData, features: e.target.value.split('\n') })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Challenges & Solutions</label>
            <textarea
              value={formData.challenges || ''}
              onChange={(e) => setFormData({ ...formData, challenges: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-3">Screenshots</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {(formData.screenshots || []).map((screenshot, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-slate-800">
                  <img
                    src={screenshot}
                    alt={`Screenshot ${index + 1}`}
                    className="w-full h-24 object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeScreenshot(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
              
              <button
                type="button"
                onClick={() => screenshotInputRef.current?.click()}
                disabled={screenshotUploading}
                className="h-24 border border-dashed border-slate-700 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-indigo-500 hover:bg-indigo-500/5 transition-all"
              >
                {screenshotUploading ? (
                  <Loader2 className="w-5 h-5 text-indigo-500 animate-spin" />
                ) : (
                  <>
                    <Plus className="w-5 h-5 text-slate-500" />
                    <span className="text-xs text-slate-500">Add New</span>
                  </>
                )}
              </button>
              <input
                ref={screenshotInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) uploadScreenshot(file);
                }}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};

// Skill Form Component
const SkillForm: React.FC<{
  skill: SkillData;
  onSave: (skill: SkillData) => void;
  onCancel: () => void;
  isEditing?: boolean;
}> = ({ skill, onSave, onCancel, isEditing }) => {
  const [formData, setFormData] = useState(skill);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="p-8 max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-6">
          <h3 className="text-xl font-semibold text-white">
            {isEditing ? 'Edit Skill' : 'New Skill'}
          </h3>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Save size={16} />
              Save Skill
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Category</label>
            <input
              type="text"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Icon (Iconify name)</label>
          <div className="flex gap-3">
            <input
              type="text"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
              required
            />
            <div className="w-12 h-12 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
              <span className="iconify text-2xl text-slate-200" data-icon={formData.icon}></span>
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <label className="block text-sm font-medium text-slate-300">Proficiency Level</label>
            <span className="text-sm font-mono text-indigo-400">{formData.level}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.level}
            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Text Color Class</label>
            <input
              type="text"
              value={formData.color}
              onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              placeholder="text-cyan-400"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Bar Color Class</label>
            <input
              type="text"
              value={formData.barColor}
              onChange={(e) => setFormData({ ...formData, barColor: e.target.value })}
              placeholder="to-cyan-400"
              className="w-full px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-lg text-white focus:border-indigo-500 focus:outline-none transition-colors"
            />
          </div>
        </div>
      </form>
    </Card>
  );
};

export default AdminDashboard;
