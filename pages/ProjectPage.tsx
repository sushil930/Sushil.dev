import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Github, Monitor, Layers, Cpu, AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';
import { getProjects } from '../utils/dataManager';
import { Project } from '../types';
import Button from '../components/Button';
import LiquidGlassCard from '../components/LiquidGlassCard';
import CursorGravity from '../components/CursorGravity';

const ProjectPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const loadProject = async () => {
      const projects = await getProjects();
      if (projects) {
        const found = projects.find(p => p.id === Number(id));
        setProject(found || null);
      }
      setLoading(false);
    };
    loadProject();
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>;
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <h2 className="text-2xl font-pixel mb-4">Project Not Found</h2>
          <Link to="/">
            <Button variant="primary">Return Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'Completed': return 'text-neon-green border-neon-green';
      case 'In Progress': return 'text-yellow-400 border-yellow-400';
      case 'Maintenance': return 'text-blue-400 border-blue-400';
      default: return 'text-slate-400 border-slate-400';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle size={16} />;
      case 'In Progress': return <Clock size={16} />;
      case 'Maintenance': return <Wrench size={16} />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 relative text-slate-200 pb-20">
      {/* Cursor Gravity Effect */}
      <CursorGravity />
      
      {/* Ambient Liquid Blobs for Glass Effect */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-neon-purple/20 rounded-full blur-[120px] animate-blob mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[-10%] w-[400px] h-[400px] bg-neon-green/10 rounded-full blur-[100px] animate-blob delay-2000 mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[120px] animate-blob delay-4000 mix-blend-screen"></div>
      </div>

      {/* CRT Overlay Effect - Subtle scanlines */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-10 crt-overlay"></div>
      
      {/* Background Gradient for depth */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-transparent via-slate-950/60 to-slate-950 z-0"></div>

      {/* Header Image */}
      <div className="relative h-[50vh] w-full overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950 z-10" />
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover opacity-60"
        />
        
        <div className="absolute top-8 left-8 z-20">
          <Link to="/">
            <Button variant="outline" size="sm" className="flex items-center gap-2 bg-slate-900/50 backdrop-blur-md border-slate-700 hover:border-neon-green">
              <ArrowLeft size={16} /> Back to Projects
            </Button>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <div className="mb-4">
                  <LiquidGlassCard className={`inline-flex items-center justify-center px-4 py-1.5 rounded-full border text-xs font-mono whitespace-nowrap ${getStatusColor(project.status)}`}>
                    <span className="leading-none">
                      {project.status || 'Unknown Status'}
                    </span>
                  </LiquidGlassCard>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-2 font-pixel tracking-wide">
                  {project.title}
                </h1>
                <p className="text-xl text-neon-green font-mono">
                  {project.description}
                </p>
              </div>
              
              <div className="flex gap-4">
                <a href={project.liveLink} target="_blank" rel="noopener noreferrer">
                  <LiquidGlassCard className="inline-block">
                    <Button variant="primary" className="flex items-center gap-2 bg-transparent border-none text-neon-green">
                      <Monitor size={24} /> Live Demo
                    </Button>
                  </LiquidGlassCard>
                </a>
                <a href={project.codeLink} target="_blank" rel="noopener noreferrer">
                  <LiquidGlassCard className="inline-block">
                    <Button variant="outline" className="flex items-center gap-2 bg-transparent border-none">
                      <Github size={24} /> View Code
                    </Button>
                  </LiquidGlassCard>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            
            {/* Overview */}
            <section>
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <Layers className="text-neon-green" /> Project Overview
              </h2>
              <div className="prose prose-invert max-w-none text-slate-100 leading-relaxed">
                <p>{project.longDescription || project.description}</p>
              </div>
            </section>

            {/* Screenshots Gallery */}
            {project.screenshots && project.screenshots.length > 0 && (
              <section>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <Monitor className="text-neon-green" /> Gallery
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.screenshots.map((shot, index) => (
                    <LiquidGlassCard key={index} className="overflow-hidden group cursor-pointer">
                      <img 
                        src={shot} 
                        alt={`Screenshot ${index + 1}`} 
                        className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </LiquidGlassCard>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            
            {/* Tech Stack */}
            <LiquidGlassCard className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Cpu size={20} className="text-neon-green" /> Tech Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.tech.map(t => (
                  <span key={t} className="px-3 py-1 bg-slate-800 text-neon-green text-sm font-mono rounded border border-slate-700">
                    {t}
                  </span>
                ))}
              </div>
            </LiquidGlassCard>

            {/* Key Features */}
            {project.features && project.features.length > 0 && (
              <LiquidGlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CheckCircle size={20} className="text-neon-green" /> Key Features
                </h3>
                <ul className="space-y-3">
                  {project.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-neon-green shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </LiquidGlassCard>
            )}

            {/* Challenges */}
            {project.challenges && (
              <LiquidGlassCard className="p-6">
                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <AlertTriangle size={20} className="text-yellow-400" /> Challenges
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  {project.challenges}
                </p>
              </LiquidGlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectPage;
