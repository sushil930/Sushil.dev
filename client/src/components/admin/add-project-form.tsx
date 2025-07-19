import React, { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Project } from '@shared/schema';
import { useLocation } from 'wouter';

interface AddProjectFormProps {
  initialData?: Project;
  projectId?: string;
}

const AddProjectForm: React.FC<AddProjectFormProps> = ({ initialData, projectId }) => {
  const isEditMode = !!initialData;
  const [project, setProject] = useState<Partial<Project>>({
    title: '',
    description: '',
    fullDescription: '',
    image: '',
    liveUrl: '',
    githubUrl: '',
    technologies: [],
    features: [],
    images: [],
    status: 'planning',
  });
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const queryClient = useQueryClient();
  const [, navigate] = useLocation();

  useEffect(() => {
    if (initialData) {
      setProject({
        ...initialData,
        technologies: initialData.technologies || [],
        features: initialData.features || [],
        images: initialData.images || [],
      });
    }
  }, [initialData]);

  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary config from Vite env
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    setUploading(true);
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.secure_url) return data.secure_url;
      throw new Error(data.error?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadToCloudinary(file);
      setProject(prev => ({ ...prev, image: url }));
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleGalleryImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const urls: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const url = await uploadToCloudinary(files[i]);
        urls.push(url);
      }
      setProject(prev => ({ ...prev, images: [...(prev.images || []), ...urls] }));
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setProject(prev => ({ ...prev, images: prev.images?.filter((_, i) => i !== idx) }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Project) => {
    const { value } = e.target;
    setProject(prev => ({ ...prev, [field]: value.split(',').map(item => item.trim()) as any }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    try {
      const response = await fetch(isEditMode ? `/api/projects/${projectId}` : '/api/projects', {
        method: isEditMode ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add project');
      }

      setFeedback({ type: 'success', message: `Project ${isEditMode ? 'updated' : 'added'} successfully!` });
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      if (isEditMode && projectId) {
        queryClient.invalidateQueries({ queryKey: ['project', projectId] });
      }
      if (!isEditMode) {
        setProject({
          title: '',
          description: '',
          fullDescription: '',
          image: '',
          liveUrl: '',
          githubUrl: '',
          technologies: [],
          features: [],
          images: [],
          status: 'planning',
        });
      } else {
        // After successful edit, navigate back to the manage page
        setTimeout(() => navigate('/admin/add-project'), 2000);
      }
    } catch (error: any) {
      setFeedback({ type: 'error', message: error.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-center text-neon-green">{isEditMode ? 'Edit Project' : 'Add New Project'}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="title" value={project.title} onChange={handleChange} placeholder="Project Title" className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green" required />
          <input name="description" value={project.description} onChange={handleChange} placeholder="Short Description" className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green" required />
        </div>
        <textarea name="fullDescription" value={project.fullDescription} onChange={handleChange} placeholder="Full Project Description" className="w-full bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green" rows={4}></textarea>

        {/* Main Image */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">Main Image</label>
          <div className="flex items-center gap-4">
            <input name="image" value={project.image} onChange={handleChange} placeholder="Image URL or use upload" className="w-full bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green" required />
            <button type="button" className="p-2 bg-neon-green text-black font-bold rounded hover:bg-white hover:text-black transition-colors duration-300" onClick={() => fileInputRef.current?.click()} disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
            <input type="file" accept="image/*" style={{ display: 'none' }} ref={fileInputRef} onChange={handleMainImageUpload} />
          </div>
          {project.image && <img src={project.image} alt="Preview" className="mt-4 w-48 h-auto rounded-lg" />}
        </div>

        {/* URLs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input name="liveUrl" value={project.liveUrl} onChange={handleChange} placeholder="Live Demo URL" className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-neon-green" />
          <input name="githubUrl" value={project.githubUrl} onChange={handleChange} placeholder="GitHub URL" className="bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green" />
        </div>

        {/* Details */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">Technologies (comma-separated)</label>
          <input name="technologies" value={project.technologies?.join(', ')} onChange={(e) => handleArrayChange(e, 'technologies')} placeholder="React, Node.js, TailwindCSS" className="w-full bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">Features (comma-separated)</label>
          <input name="features" value={project.features?.join(', ')} onChange={(e) => handleArrayChange(e, 'features')} placeholder="Real-time updates, User authentication" className="w-full bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green" />
        </div>
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">Gallery Images</label>
          <div className="flex gap-2 mb-2">
            <input
              name="images"
              value={project.images?.join(', ')}
              onChange={(e) => handleArrayChange(e, 'images')}
              placeholder="Paste image URLs or use upload"
              className="w-full bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green"
            />
            <button
              type="button"
              className="p-2 bg-neon-green text-black font-bold rounded hover:bg-white hover:text-black transition-colors duration-300"
              onClick={() => galleryInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
            <input
              type="file"
              accept="image/*"
              multiple
              style={{ display: 'none' }}
              ref={galleryInputRef}
              onChange={handleGalleryImageUpload}
            />
          </div>
          {project.images && project.images.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-2">
              {project.images.map((img, idx) => (
                <div key={img+idx} className="relative group">
                  <img src={img} alt={`Gallery ${idx+1}`} className="w-24 h-16 object-cover rounded border border-pixel-orange" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(idx)}
                    className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-bl px-2 py-1 opacity-80 group-hover:opacity-100"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Status */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-400">Status</label>
          <select name="status" value={project.status} onChange={handleChange} className="w-full bg-gray-800 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-neon-green">
            <option value="planning">Planning</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Submit Button */}
        <button type="submit" className="w-full p-2 bg-neon-green text-black font-bold rounded hover:bg-white hover:text-black transition-colors duration-300">{isEditMode ? 'Update Project' : 'Add Project'}</button>
      </form>

      {/* Feedback Message */}
      {feedback && (
        <div className={`mt-4 p-3 rounded-md text-center ${feedback.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {feedback.message}
        </div>
      )}
    </div>
  );
};

export default AddProjectForm;
