import React, { useEffect } from 'react';
import { X, Github, Monitor, ArrowRight, Layers, Cpu, AlertTriangle } from 'lucide-react';
import { Project } from '../types';
import Button from './Button';

interface ProjectDetailsProps {
  project: Project;
  onClose: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onClose }) => {
  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-5xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col animate-fade-in-up">
        
        {/* Header Image */}
        <div className="relative h-48 md:h-64 lg:h-80 shrink-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent z-10" />
          <img 
            src={project.image} 
            alt={project.title} 
            className="w-full h-full object-cover"
          />
          
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 bg-slate-950/50 hover:bg-slate-900 text-slate-400 hover:text-white rounded-full border border-slate-800 transition-colors backdrop-blur-sm"
          >
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="p-6 md:p-10 space-y-10">
            
            {/* Title & Links */}
            <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">{project.title}</h2>
                <p className="text-neon-green font-mono text-sm md:text-base">
                  {project.tech.join(' • ')}
                </p>
              </div>
              
              <div className="flex gap-3 w-full md:w-auto">
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                  <Button variant="primary" size="sm" fullWidth className="flex items-center justify-center gap-2">
                    <Monitor size={16} /> Live Demo
                  </Button>
                </a>
                <a href={project.codeLink} target="_blank" rel="noopener noreferrer" className="flex-1 md:flex-none">
                  <Button variant="outline" size="sm" fullWidth className="flex items-center justify-center gap-2">
                    <Github size={16} /> Source Code
                  </Button>
                </a>
              </div>
            </div>

            {/* Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-8">
                <section>
                  <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                    <Layers className="text-neon-purple" size={20} />
                    Project Overview
                  </h3>
                  <p className="text-slate-300 leading-relaxed text-lg">
                    {project.longDescription || project.description}
                  </p>
                </section>

                {project.challenges && (
                  <section>
                    <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                      <AlertTriangle className="text-yellow-500" size={20} />
                      Challenges & Solutions
                    </h3>
                    <p className="text-slate-300 leading-relaxed">
                      {project.challenges}
                    </p>
                  </section>
                )}
              </div>

              <div className="space-y-8">
                {project.features && (
                  <section className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800">
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                      <Cpu className="text-neon-green" size={20} />
                      Key Features
                    </h3>
                    <ul className="space-y-3">
                      {project.features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-3 text-slate-400 text-sm">
                          <ArrowRight size={16} className="text-neon-green shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
