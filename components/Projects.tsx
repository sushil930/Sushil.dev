import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import { Github, Monitor } from 'lucide-react';
import { Project } from '../types';
import { getProjects } from '../utils/dataManager';
import LiquidGlassCard from './LiquidGlassCard';

const ProjectCard: React.FC<{ project: Project; onClick: () => void }> = ({ project, onClick }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <LiquidGlassCard 
      // Removed hover:scale-[1.02]
      // Changed shadow to black and reduced spread (volume)
      className="group transition-all duration-300 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] flex flex-col h-full cursor-pointer"
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-800/50">
         <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10" />
         
         {/* Loading Placeholder */}
         <div className={`absolute inset-0 bg-slate-800 animate-pulse transition-opacity duration-500 ${imageLoaded ? 'opacity-0' : 'opacity-100'}`} />

        <img 
          src={project.image} 
          alt={project.title}
          loading="lazy"
          decoding="async" 
          onLoad={() => setImageLoaded(true)}
          onError={() => setImageLoaded(true)}
          // Removed group-hover:scale-110 to reduce "blur"/motion distraction
          // Changed opacity-0 to opacity-100 to ensure visibility on mobile
          className={`w-full h-full object-cover transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100 blur-0' : 'opacity-100 blur-sm'}`}
        />
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-grow">
        <h3 className="font-pixel text-sm text-white mb-2 group-hover:text-neon-green transition-colors duration-300">{project.title}</h3>
        <p className="text-slate-300 text-sm mb-4 flex-grow line-clamp-3">
          {project.description}
        </p>
        
        {/* Tech Stack */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(project.tech || []).map(t => (
            <span key={t} className="text-[10px] uppercase font-mono px-2 py-1 bg-slate-800/50 text-slate-300 rounded border border-slate-700/50 group-hover:border-slate-500 transition-colors backdrop-blur-sm">
              {t}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-auto" onClick={(e) => e.stopPropagation()}>
          <a href={project.liveLink} className="flex-1" target="_blank" rel="noopener noreferrer">
            <LiquidGlassCard 
              className="border border-neon-green/40 hover:border-neon-green transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,222,128,0.4)] rounded-lg p-0.5"
              style={{ '--bg-color': 'rgba(74, 222, 128, 0.15)' } as React.CSSProperties}
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2 text-neon-green hover:text-white transition-colors font-mono text-sm">
                <Monitor size={14} /> Live
              </div>
            </LiquidGlassCard>
          </a>
          <a href={project.codeLink} className="flex-1" target="_blank" rel="noopener noreferrer">
            <LiquidGlassCard 
              className="border border-white/20 hover:border-white/60 transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-lg p-0.5"
              style={{ '--bg-color': 'rgba(255, 255, 255, 0.08)' } as React.CSSProperties}
            >
              <div className="flex items-center justify-center gap-2 px-4 py-2 text-white/80 hover:text-white transition-colors font-mono text-sm">
                <Github size={14} /> Code
              </div>
            </LiquidGlassCard>
          </a>
        </div>
      </div>
    </LiquidGlassCard>
  );
};

const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const storedProjects = await getProjects();
      if (storedProjects && storedProjects.length > 0) {
        setProjects(storedProjects);
      }
    };
    loadProjects();
  }, []);

  return (
    <section id="projects" className="py-24 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Recent Projects
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Selected works demonstrating full-stack capabilities and design precision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              onClick={() => navigate(`/project/${project.id}`)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;