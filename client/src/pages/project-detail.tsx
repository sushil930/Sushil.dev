import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Github, Calendar, Users, Tag, Code, Play, GitBranch, Clock, Eye, Star } from "lucide-react";
import { ProjectCard } from "@/lib/types";
import { useState } from "react";

// Static project data for fallback
const detailedProjects: Record<number, ProjectCard> = {
  1: {
    id: 1,
    title: "E-Commerce Platform",
    description: "Modern online marketplace with advanced features",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    liveUrl: "https://ecommerce-demo.vercel.app",
    githubUrl: "https://github.com/example/ecommerce",
    fullDescription: "A comprehensive e-commerce platform built with modern web technologies. Features include user authentication, product catalog, shopping cart, payment processing, order management, and admin dashboard. The platform is designed for scalability and optimal user experience.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Redux", "Express"],
    features: [
      "User authentication and authorization",
      "Product catalog with search and filtering",
      "Shopping cart and checkout process",
      "Payment integration with Stripe",
      "Order tracking and management",
      "Admin dashboard for product management"
    ],
    images: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
    ],
    category: "Full-Stack Development",
    duration: "3 months",
    team: "Solo Project",
    status: "completed",
    lastCommit: "2024-01-15T10:30:00Z",
    commitMessage: "feat: add payment processing with Stripe integration"
  },
  2: {
    id: 2,
    title: "Portfolio Website",
    description: "Retro-themed developer portfolio with modern features",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    githubUrl: "#",
    fullDescription: "A pixel-perfect portfolio website showcasing development skills with a retro gaming aesthetic. Built with modern web technologies and featuring smooth animations, responsive design, and interactive elements.",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Vite", "Framer Motion"],
    features: [
      "Pixel art animations and retro styling",
      "Responsive design for all devices",
      "Interactive snake game component",
      "Smooth scrolling navigation",
      "Contact form with validation",
      "Cross-browser compatibility"
    ],
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
    ],
    category: "Frontend Development",
    duration: "2 months",
    team: "Solo Project",
    status: "completed",
    lastCommit: "2024-01-20T14:45:00Z",
    commitMessage: "style: enhance retro animations and pixel effects"
  }
};

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [selectedImage, setSelectedImage] = useState(0);
  
    const projectId = params?.id;
  
  // Try to fetch project from API first
      const { data: apiProject, isLoading, isError, error } = useQuery<ProjectCard>({
    queryKey: ['/api/projects', projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error('No project ID provided');
      }
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Network response was not ok' }));
        throw new Error(errorData.message);
      }
      return response.json();
    },
        enabled: !!projectId,
  });
  
  // Fallback to static project data if API doesn't have it
      const project = apiProject || (projectId ? detailedProjects[Number(projectId)] : undefined);

  if (isError) {
    return (
      <div className="container mx-auto text-center py-40">
        <h2 className="font-pixel text-3xl text-red-500 mb-4">ERROR LOADING PROJECT</h2>
        <p className="font-retro text-lg text-gray-400">
          Could not fetch project data. Please try again later.
        </p>
        <p className="font-mono text-sm text-red-400/70 mt-4 bg-black/30 p-4 rounded-lg inline-block">
          {error?.message || 'An unknown error occurred.'}
        </p>
      </div>
    );
  }
  
    if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-[var(--neon-green)] font-pixel text-xl">LOADING PROJECT...</div>
      </div>
    );
  }
  
    if (!project) {
    return (
      <div className="min-h-screen bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[var(--hot-pink)] font-pixel text-2xl mb-4">PROJECT NOT FOUND</div>
          <Button 
            onClick={() => navigate('/')}
            className="font-pixel bg-[var(--neon-green)] text-[var(--dark-navy)] hover:bg-[var(--neon-green)]/80"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO HOME
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status: string | undefined) => {
    if (!status) return '#EAEAEA';
    switch (status.toLowerCase()) {
      case 'completed': return '#00FF41';
      case 'in-progress': return '#FFD700';
      case 'planning': return '#FF6B35';
      default: return '#EAEAEA';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dark-navy)] text-white pt-7">
      {/* Header */}
      <div className="border-b border-[var(--neon-green)]/20 bg-[var(--charcoal-grey)]/20 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Button 
              onClick={() => navigate('/')}
              variant="ghost"
              className="font-pixel text-[var(--neon-green)] hover:bg-[var(--neon-green)]/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              PROJECTS
            </Button>
            <div className="flex items-center gap-4">
              <Badge 
                className="font-pixel text-xs px-3 py-1"
                style={{ 
                  backgroundColor: `${getStatusColor(project.status)}20`,
                  color: getStatusColor(project.status),
                  border: `1px solid ${getStatusColor(project.status)}`
                }}
              >
                {project.status?.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 py-12">
        {/* Project Title */}
        <div className="mb-8">
          <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl text-[var(--neon-green)] mb-4 leading-tight">{project.title}</h1>
          <p className="font-retro text-lg text-[var(--light-grey)] max-w-3xl">{project.description}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2 space-y-8 order-2 lg:order-1">
            
            {/* Live Preview Section */}
            <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--neon-green)]/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Eye className="w-6 h-6 text-[var(--neon-green)]" />
                <h2 className="font-pixel text-2xl text-[var(--neon-green)]">LIVE PREVIEW</h2>
              </div>
              {project.liveUrl && project.liveUrl !== '#' ? (
                <div className="space-y-4">
                  <div className="aspect-video bg-[var(--dark-navy)] border border-[var(--neon-green)]/20 rounded-lg overflow-hidden">
                    <iframe
                      src={project.liveUrl}
                      className="w-full h-full"
                      title={`${project.title} Live Preview`}
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                  <Button 
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="w-full font-pixel bg-[var(--neon-green)]/10 text-[var(--neon-green)] border-2 border-[var(--neon-green)] hover:bg-[var(--neon-green)] hover:text-[var(--dark-navy)]"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    OPEN IN NEW TAB
                  </Button>
                </div>
              ) : (
                <div className="aspect-video bg-[var(--dark-navy)] border border-[var(--hot-pink)]/20 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <Play className="w-12 h-12 text-[var(--hot-pink)] mx-auto mb-4 opacity-50" />
                    <p className="font-retro text-[var(--light-grey)]">Live preview coming soon</p>
                  </div>
                </div>
              )}
            </section>

            {/* Project Info Section (Description and Features) */}
            <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--pixel-orange)]/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Code className="w-6 h-6 text-[var(--pixel-orange)]" />
                <h2 className="font-pixel text-2xl text-[var(--pixel-orange)]">PROJECT INFO</h2>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="font-pixel text-lg text-[var(--neon-green)] mb-2">DESCRIPTION</h3>
                  <p className="font-retro text-[var(--light-grey)] leading-relaxed">{project.fullDescription}</p>
                </div>
                {project.features && (
                  <div>
                    <h3 className="font-pixel text-lg text-[var(--neon-green)] mb-2">KEY FEATURES</h3>
                    <ul className="space-y-2">
                      {project.features?.map((feature: string, index: number) => (
                        <li key={index} className="font-retro text-[var(--light-grey)] flex items-start gap-2">
                          <span className="text-[var(--pixel-orange)] mt-1">▸</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--pixel-orange)]/20">
                  <div>
                    <span className="font-pixel text-[var(--pixel-orange)] text-sm">CATEGORY</span>
                    <p className="font-retro text-[var(--light-grey)]">{project.category}</p>
                  </div>
                  <div>
                    <span className="font-pixel text-[var(--pixel-orange)] text-sm">DURATION</span>
                    <p className="font-retro text-[var(--light-grey)]">{project.duration}</p>
                  </div>
                  <div>
                    <span className="font-pixel text-[var(--pixel-orange)] text-sm">TEAM</span>
                    <p className="font-retro text-[var(--light-grey)]">{project.team}</p>
                  </div>
                  <div>
                    <span className="font-pixel text-[var(--pixel-orange)] text-sm">STATUS</span>
                    <p className="font-retro font-semibold" style={{ color: getStatusColor(project.status) }}>
                      {project.status?.toUpperCase()}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Tech Stack Section */}
            <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--neon-green)]/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <Tag className="w-6 h-6 text-[var(--neon-green)]" />
                <h3 className="font-pixel text-xl text-[var(--neon-green)]">TECH STACK</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {project.technologies?.map((tech: string, index: number) => (
                  <Badge
                    key={index}
                    className="font-pixel text-xs px-3 py-1 bg-[var(--neon-green)]/10 text-[var(--neon-green)] border border-[var(--neon-green)]/30"
                  >
                    {tech}
                  </Badge>
                ))}
              </div>
            </section>

            {/* Project Links Section */}
            <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--hot-pink)]/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <ExternalLink className="w-6 h-6 text-[var(--hot-pink)]" />
                <h3 className="font-pixel text-xl text-[var(--hot-pink)]">LINKS</h3>
              </div>
              <div className="space-y-3">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <Button 
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="w-full font-pixel text-sm bg-[var(--neon-green)]/10 text-[var(--neon-green)] border border-[var(--neon-green)]/30 hover:bg-[var(--neon-green)] hover:text-[var(--dark-navy)]"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    LIVE DEMO
                  </Button>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <Button 
                    onClick={() => window.open(project.githubUrl, '_blank')}
                    className="w-full font-pixel text-sm bg-[var(--hot-pink)]/10 text-[var(--hot-pink)] border border-[var(--hot-pink)]/30 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)]"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    SOURCE CODE
                  </Button>
                )}
              </div>
            </section>

            {/* Gallery Section */}
            {project.images && project.images.length > 0 && (
              <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--hot-pink)]/30 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Star className="w-6 h-6 text-[var(--hot-pink)]" />
                  <h2 className="font-pixel text-2xl text-[var(--hot-pink)]">GALLERY</h2>
                </div>
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="aspect-video bg-[var(--dark-navy)] border border-[var(--hot-pink)]/20 rounded-lg overflow-hidden">
                    <img
                      src={project.images[selectedImage]}
                      alt={`${project.title} Screenshot ${selectedImage + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {/* Thumbnail Navigation */}
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {project.images?.map((image: string, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-12 rounded border-2 overflow-hidden transition-all ${
                          selectedImage === index 
                            ? 'border-[var(--hot-pink)]' 
                            : 'border-[var(--hot-pink)]/20 hover:border-[var(--hot-pink)]/50'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Sidebar - Right Column */}
          <div className="space-y-6 order-1 lg:order-2">

            {/* Project Links */}
            <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--hot-pink)]/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <ExternalLink className="w-6 h-6 text-[var(--hot-pink)]" />
                <h3 className="font-pixel text-xl text-[var(--hot-pink)]">LINKS</h3>
              </div>
              <div className="space-y-3">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <Button 
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="w-full font-pixel text-sm bg-[var(--neon-green)]/10 text-[var(--neon-green)] border border-[var(--neon-green)]/30 hover:bg-[var(--neon-green)] hover:text-[var(--dark-navy)]"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    LIVE DEMO
                  </Button>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <Button 
                    onClick={() => window.open(project.githubUrl, '_blank')}
                    className="w-full font-pixel text-sm bg-[var(--hot-pink)]/10 text-[var(--hot-pink)] border border-[var(--hot-pink)]/30 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)]"
                  >
                    <Github className="w-4 h-4 mr-2" />
                    SOURCE CODE
                  </Button>
                )}
              </div>
            </section>

            {/* Last Commit */}
            {project.lastCommit && (
              <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--pixel-orange)]/30 rounded-lg p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <GitBranch className="w-6 h-6 text-[var(--pixel-orange)]" />
                  <h3 className="font-pixel text-xl text-[var(--pixel-orange)]">LAST COMMIT</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="w-4 h-4 text-[var(--pixel-orange)]" />
                    <span className="font-retro text-[var(--light-grey)]">
                      {formatDate(project.lastCommit)}
                    </span>
                  </div>
                  {project.commitMessage && (
                    <div className="bg-[var(--dark-navy)]/50 border border-[var(--pixel-orange)]/20 rounded p-3">
                      <p className="font-mono text-sm text-[var(--light-grey)]">
                        {project.commitMessage}
                      </p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
