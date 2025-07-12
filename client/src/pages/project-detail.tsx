import { useParams, useLocation } from "wouter";
import { ProjectCard } from "@/lib/types";
import { ArrowLeft, ExternalLink, Github, Play, Code, Calendar, Users, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";

// Extended project data with detailed information
const detailedProjects: Record<number, ProjectCard> = {
  1: {
    id: 1,
    title: "E-COMMERCE PLATFORM",
    description: "React • Redux • Stripe API",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
    githubUrl: "#",
    fullDescription: "A comprehensive e-commerce platform built with modern web technologies. This project showcases advanced React patterns, state management with Redux, and secure payment processing through Stripe API integration. The platform features a responsive design, real-time inventory management, and a complete admin dashboard for order management.",
    technologies: ["React", "Redux", "TypeScript", "Tailwind CSS", "Stripe API", "Node.js", "Express", "MongoDB", "JWT Authentication"],
    features: [
      "User authentication and authorization",
      "Product catalog with search and filtering", 
      "Shopping cart and wishlist functionality",
      "Secure payment processing with Stripe",
      "Order tracking and history",
      "Admin dashboard for inventory management",
      "Real-time notifications",
      "Responsive mobile-first design"
    ],
    challenges: [
      "Implementing secure payment processing while maintaining user experience",
      "Optimizing performance for large product catalogs",
      "Creating a scalable admin interface for inventory management",
      "Ensuring cross-browser compatibility and accessibility"
    ],
    images: [
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
    ],
    category: "Web Development",
    duration: "3 months",
    team: "Solo Project",
    status: "completed"
  },
  2: {
    id: 2,
    title: "ANALYTICS DASHBOARD",
    description: "Vue.js • D3.js • Firebase",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
    githubUrl: "#",
    fullDescription: "An advanced analytics dashboard that visualizes complex data sets using D3.js and Vue.js. This project demonstrates expertise in data visualization, real-time updates, and creating intuitive user interfaces for data analysis. The dashboard supports multiple chart types, custom filters, and exportable reports.",
    technologies: ["Vue.js", "D3.js", "Firebase", "Vuex", "Chart.js", "Sass", "Webpack", "ESLint"],
    features: [
      "Interactive data visualizations with D3.js",
      "Real-time data updates via Firebase",
      "Customizable dashboard widgets",
      "Advanced filtering and search capabilities",
      "Export functionality for reports and charts",
      "Multi-user collaboration features",
      "Responsive design for all devices",
      "Dark/light theme switching"
    ],
    challenges: [
      "Optimizing D3.js performance with large datasets",
      "Creating smooth real-time data synchronization",
      "Designing intuitive data visualization interfaces",
      "Implementing efficient data caching strategies"
    ],
    images: [
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
    ],
    category: "Data Visualization",
    duration: "4 months",
    team: "Team of 3",
    status: "completed"
  },
  3: {
    id: 3,
    title: "MOBILE GAME APP",
    description: "React Native • WebGL • Node.js",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
    githubUrl: "#",
    fullDescription: "A cross-platform mobile game built with React Native and WebGL for high-performance graphics. This project showcases mobile development expertise, game mechanics implementation, and real-time multiplayer functionality with Node.js backend integration.",
    technologies: ["React Native", "WebGL", "Node.js", "Socket.io", "Redux", "Expo", "Three.js", "MongoDB"],
    features: [
      "Cross-platform mobile compatibility",
      "High-performance WebGL graphics",
      "Real-time multiplayer gameplay",
      "Achievement and leaderboard system",
      "In-app purchases integration",
      "Push notifications",
      "Offline mode support",
      "Social sharing capabilities"
    ],
    challenges: [
      "Optimizing WebGL performance on mobile devices",
      "Implementing smooth real-time multiplayer synchronization",
      "Managing memory efficiently for mobile platforms",
      "Creating engaging game mechanics and user experience"
    ],
    images: [
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1511512578047-dfb367046420?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
    ],
    category: "Mobile Development",
    duration: "6 months",
    team: "Team of 4",
    status: "completed"
  },
  4: {
    id: 4,
    title: "SOCIAL PLATFORM",
    description: "Next.js • GraphQL • PostgreSQL",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
    githubUrl: "#",
    fullDescription: "A modern social networking platform built with Next.js and GraphQL, featuring real-time messaging, content sharing, and advanced user interaction features. The platform emphasizes performance, scalability, and user privacy with robust backend architecture.",
    technologies: ["Next.js", "GraphQL", "Apollo Client", "PostgreSQL", "Prisma", "TypeScript", "Tailwind CSS", "Redis"],
    features: [
      "Real-time messaging and notifications",
      "Content sharing with media uploads",
      "Advanced user profiles and connections",
      "News feed with algorithmic sorting",
      "Privacy controls and content moderation",
      "Search and discovery features",
      "Mobile-responsive design",
      "API rate limiting and security"
    ],
    challenges: [
      "Implementing scalable real-time features",
      "Designing efficient GraphQL schemas",
      "Managing complex user relationships and privacy",
      "Optimizing database queries for performance"
    ],
    images: [
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
    ],
    category: "Full-Stack Development",
    duration: "8 months",
    team: "Team of 5",
    status: "completed"
  },
  5: {
    id: 5,
    title: "CRYPTO TRADER",
    description: "React • Web3.js • Solidity",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
    githubUrl: "#",
    fullDescription: "A decentralized cryptocurrency trading platform built on blockchain technology. This project demonstrates expertise in Web3 development, smart contract creation, and DeFi protocols. Features include automated trading strategies, portfolio management, and secure wallet integration.",
    technologies: ["React", "Web3.js", "Solidity", "Ethereum", "Hardhat", "MetaMask", "Ethers.js", "IPFS"],
    features: [
      "Decentralized wallet connectivity",
      "Real-time cryptocurrency prices",
      "Automated trading strategies",
      "Portfolio tracking and analytics",
      "Smart contract interactions",
      "DeFi protocol integration",
      "Security auditing tools",
      "Multi-chain support"
    ],
    challenges: [
      "Implementing secure smart contract logic",
      "Managing blockchain transaction costs",
      "Creating intuitive Web3 user experiences",
      "Ensuring smart contract security and auditing"
    ],
    images: [
      "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
    ],
    category: "Blockchain Development",
    duration: "5 months",
    team: "Solo Project",
    status: "in-progress"
  },
  6: {
    id: 6,
    title: "PIXEL PORTFOLIO",
    description: "HTML5 • CSS3 • JavaScript",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
    githubUrl: "#",
    fullDescription: "A creative pixel art-themed portfolio website showcasing frontend development skills and artistic design. This project demonstrates mastery of CSS animations, JavaScript interactions, and responsive design principles with a unique retro gaming aesthetic.",
    technologies: ["HTML5", "CSS3", "JavaScript", "Canvas API", "Web Animations API", "Intersection Observer"],
    features: [
      "Pixel art animations and effects",
      "Interactive canvas elements",
      "Smooth scroll animations",
      "Retro gaming sound effects",
      "Responsive pixel art scaling",
      "Contact form with validation",
      "SEO optimization",
      "Cross-browser compatibility"
    ],
    challenges: [
      "Creating scalable pixel art for different screen sizes",
      "Implementing smooth animations without performance issues",
      "Maintaining retro aesthetic while ensuring accessibility",
      "Balancing creativity with usability"
    ],
    images: [
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800",
      "https://images.unsplash.com/photo-1614741118887-7a4ee193a5fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=800"
    ],
    category: "Frontend Development",
    duration: "2 months",
    team: "Solo Project",
    status: "completed"
  }
};

export default function ProjectDetail() {
  const params = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  
  const projectId = params?.id ? parseInt(params.id) : null;
  
  // Try to fetch project from API first
  const { data: apiProject, isLoading } = useQuery<ProjectCard>({
    queryKey: ['/api/projects', projectId],
    enabled: !!projectId,
  });
  
  // Fallback to static project data if API doesn't have it
  const staticProject = projectId ? detailedProjects[projectId] : null;
  const project = apiProject || staticProject;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-pixel text-2xl text-[var(--neon-green)] mb-4">LOADING PROJECT...</h1>
          <div className="font-retro text-[var(--light-grey)]">Fetching project details...</div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--dark-navy)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-pixel text-2xl text-[var(--neon-green)] mb-4">PROJECT NOT FOUND</h1>
          <p className="font-retro text-[var(--light-grey)] mb-8">The project you're looking for doesn't exist.</p>
          <Button 
            onClick={() => navigate('/')}
            className="retro-button retro-button-outline-green"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            BACK TO HOME
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--neon-green)';
      case 'in-progress': return 'var(--pixel-orange)';
      case 'planning': return 'var(--hot-pink)';
      default: return 'var(--light-grey)';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--dark-navy)] text-white relative">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-2 h-2 bg-[var(--neon-green)] animate-pulse"></div>
        <div className="absolute top-40 right-20 w-2 h-2 bg-[var(--pixel-orange)] animate-pulse delay-500"></div>
        <div className="absolute top-60 left-1/3 w-2 h-2 bg-[var(--hot-pink)] animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-[var(--neon-green)] animate-pulse delay-1500"></div>
      </div>

      {/* Header */}
      <div className="border-b-2 border-[var(--neon-green)] bg-[var(--dark-navy)]/95 backdrop-blur-sm sticky top-0 z-50 shadow-lg shadow-[var(--neon-green)]/20">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <Button 
            onClick={() => navigate('/')}
            variant="ghost"
            className="font-pixel text-[var(--neon-green)] hover:bg-[var(--neon-green)]/20 border border-transparent hover:border-[var(--neon-green)] transition-all duration-300"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            BACK TO HOME
          </Button>
          
          <div className="flex gap-4">
            {project.liveUrl && project.liveUrl !== '#' && (
              <Button 
                onClick={() => window.open(project.liveUrl, '_blank')}
                className="font-pixel text-sm bg-[var(--neon-green)]/10 text-[var(--neon-green)] border-2 border-[var(--neon-green)] px-6 py-3 hover:bg-[var(--neon-green)] hover:text-[var(--dark-navy)] transition-all duration-300 transform hover:scale-105"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                LIVE DEMO
              </Button>
            )}
            {project.githubUrl && project.githubUrl !== '#' && (
              <Button 
                onClick={() => window.open(project.githubUrl, '_blank')}
                className="font-pixel text-sm bg-[var(--hot-pink)]/10 text-[var(--hot-pink)] border-2 border-[var(--hot-pink)] px-6 py-3 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)] transition-all duration-300 transform hover:scale-105"
              >
                <Github className="w-4 h-4 mr-2" />
                SOURCE CODE
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Hero Section */}
        <div className="mb-16">
          <div className="mb-8">
            <div className="mb-6">
              <h1 className="font-pixel text-4xl md:text-5xl lg:text-6xl text-[var(--neon-green)] mb-6 text-center md:text-left leading-tight">
                {project.title}
              </h1>
              <div className="w-24 h-1 bg-gradient-to-r from-[var(--neon-green)] to-[var(--pixel-orange)] mb-6"></div>
            </div>
            
            <p className="font-retro text-xl md:text-2xl text-[var(--light-grey)] mb-8 leading-relaxed">
              {project.description}
            </p>
            
            {/* Project Meta */}
            <div className="flex flex-wrap gap-6 mb-8">
              {project.category && (
                <div className="flex items-center gap-3 bg-[var(--pixel-orange)]/10 border border-[var(--pixel-orange)] rounded-lg px-4 py-2">
                  <Tag className="w-5 h-5 text-[var(--pixel-orange)]" />
                  <span className="font-retro text-[var(--pixel-orange)] font-semibold">{project.category}</span>
                </div>
              )}
              {project.duration && (
                <div className="flex items-center gap-3 bg-[var(--neon-green)]/10 border border-[var(--neon-green)] rounded-lg px-4 py-2">
                  <Calendar className="w-5 h-5 text-[var(--neon-green)]" />
                  <span className="font-retro text-[var(--neon-green)] font-semibold">{project.duration}</span>
                </div>
              )}
              {project.team && (
                <div className="flex items-center gap-3 bg-[var(--hot-pink)]/10 border border-[var(--hot-pink)] rounded-lg px-4 py-2">
                  <Users className="w-5 h-5 text-[var(--hot-pink)]" />
                  <span className="font-retro text-[var(--hot-pink)] font-semibold">{project.team}</span>
                </div>
              )}
              {project.status && (
                <div 
                  style={{ 
                    backgroundColor: `${getStatusColor(project.status)}20`,
                    borderColor: getStatusColor(project.status),
                  }}
                  className="flex items-center gap-3 border rounded-lg px-4 py-2"
                >
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: getStatusColor(project.status) }}
                  ></div>
                  <span 
                    className="font-pixel text-sm font-bold uppercase"
                    style={{ color: getStatusColor(project.status) }}
                  >
                    {project.status}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Main Image */}
          <div className="mb-12 relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--neon-green)]/20 to-[var(--pixel-orange)]/20 rounded-lg blur-xl transform scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <img
              src={project.image}
              alt={project.title}
              className="relative w-full h-64 md:h-96 lg:h-[500px] object-cover rounded-lg border-2 border-[var(--pixel-orange)] shadow-2xl shadow-[var(--pixel-orange)]/20 transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-navy)]/50 to-transparent rounded-lg"></div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Description */}
            {project.fullDescription && (
              <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--neon-green)]/30 rounded-lg p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-1 bg-[var(--neon-green)]"></div>
                  <h2 className="font-pixel text-2xl text-[var(--neon-green)]">PROJECT OVERVIEW</h2>
                </div>
                <p className="font-retro text-lg text-[var(--light-grey)] leading-relaxed">
                  {project.fullDescription}
                </p>
              </section>
            )}

            {/* Features */}
            {project.features && project.features.length > 0 && (
              <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--pixel-orange)]/30 rounded-lg p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-1 bg-[var(--pixel-orange)]"></div>
                  <h2 className="font-pixel text-2xl text-[var(--pixel-orange)]">KEY FEATURES</h2>
                </div>
                <div className="grid gap-4">
                  {project.features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 p-4 bg-[var(--dark-navy)]/50 border border-[var(--pixel-orange)]/20 rounded-lg hover:border-[var(--pixel-orange)]/40 transition-colors duration-300">
                      <div className="w-3 h-3 bg-[var(--pixel-orange)] mt-2 flex-shrink-0 rotate-45"></div>
                      <span className="font-retro text-[var(--light-grey)] text-lg">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Challenges */}
            {project.challenges && project.challenges.length > 0 && (
              <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--hot-pink)]/30 rounded-lg p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-1 bg-[var(--hot-pink)]"></div>
                  <h2 className="font-pixel text-2xl text-[var(--hot-pink)]">CHALLENGES & SOLUTIONS</h2>
                </div>
                <div className="space-y-4">
                  {project.challenges.map((challenge, index) => (
                    <div key={index} className="border-l-4 border-[var(--hot-pink)] pl-6 py-4 bg-[var(--dark-navy)]/50 rounded-r-lg">
                      <span className="font-retro text-[var(--light-grey)] text-lg leading-relaxed">{challenge}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Default content when no detailed data is available */}
            {(!project.fullDescription && (!project.features || project.features.length === 0) && (!project.challenges || project.challenges.length === 0)) && (
              <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--neon-green)]/30 rounded-lg p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-1 bg-[var(--neon-green)]"></div>
                  <h2 className="font-pixel text-2xl text-[var(--neon-green)]">PROJECT DETAILS</h2>
                </div>
                <div className="space-y-6">
                  <p className="font-retro text-lg text-[var(--light-grey)] leading-relaxed">
                    This project showcases modern web development techniques and demonstrates expertise in {project.description?.toLowerCase()}.
                  </p>
                  <div className="grid gap-4">
                    <div className="flex items-start gap-4 p-4 bg-[var(--dark-navy)]/50 border border-[var(--neon-green)]/20 rounded-lg">
                      <div className="w-3 h-3 bg-[var(--neon-green)] mt-2 flex-shrink-0 rotate-45"></div>
                      <span className="font-retro text-[var(--light-grey)] text-lg">Modern development practices and clean architecture</span>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-[var(--dark-navy)]/50 border border-[var(--neon-green)]/20 rounded-lg">
                      <div className="w-3 h-3 bg-[var(--neon-green)] mt-2 flex-shrink-0 rotate-45"></div>
                      <span className="font-retro text-[var(--light-grey)] text-lg">Responsive design and user experience optimization</span>
                    </div>
                    <div className="flex items-start gap-4 p-4 bg-[var(--dark-navy)]/50 border border-[var(--neon-green)]/20 rounded-lg">
                      <div className="w-3 h-3 bg-[var(--neon-green)] mt-2 flex-shrink-0 rotate-45"></div>
                      <span className="font-retro text-[var(--light-grey)] text-lg">Performance optimization and best practices</span>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Additional Images */}
            {project.images && project.images.length > 1 && (
              <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--pixel-orange)]/30 rounded-lg p-8 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-1 bg-[var(--pixel-orange)]"></div>
                  <h2 className="font-pixel text-2xl text-[var(--pixel-orange)]">PROJECT GALLERY</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {project.images.slice(1).map((image, index) => (
                    <div key={index} className="group relative">
                      <img
                        src={image}
                        alt={`${project.title} screenshot ${index + 2}`}
                        className="w-full h-48 object-cover rounded-lg border border-[var(--pixel-orange)] group-hover:border-[var(--neon-green)] transition-colors duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--dark-navy)]/50 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--neon-green)]/30 rounded-lg p-6 backdrop-blur-sm sticky top-32">
                <div className="flex items-center gap-3 mb-6">
                  <Code className="w-6 h-6 text-[var(--neon-green)]" />
                  <h3 className="font-pixel text-xl text-[var(--neon-green)]">TECH STACK</h3>
                </div>
                <div className="space-y-3">
                  {project.technologies.map((tech, index) => (
                    <div
                      key={index}
                      className="bg-[var(--dark-navy)]/50 border border-[var(--neon-green)]/20 rounded-lg p-3 hover:border-[var(--neon-green)]/40 transition-all duration-300 transform hover:scale-105"
                    >
                      <span className="font-retro text-[var(--light-grey)] font-semibold">{tech}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Project Stats */}
            <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--pixel-orange)]/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-6 h-6 bg-[var(--pixel-orange)] rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-[var(--dark-navy)] rounded-full"></div>
                </div>
                <h3 className="font-pixel text-xl text-[var(--pixel-orange)]">PROJECT INFO</h3>
              </div>
              <div className="space-y-4">
                {project.category && (
                  <div className="flex justify-between items-center">
                    <span className="font-retro text-[var(--light-grey)]">Category:</span>
                    <span className="font-retro text-[var(--pixel-orange)] font-semibold">{project.category}</span>
                  </div>
                )}
                {project.duration && (
                  <div className="flex justify-between items-center">
                    <span className="font-retro text-[var(--light-grey)]">Duration:</span>
                    <span className="font-retro text-[var(--pixel-orange)] font-semibold">{project.duration}</span>
                  </div>
                )}
                {project.team && (
                  <div className="flex justify-between items-center">
                    <span className="font-retro text-[var(--light-grey)]">Team:</span>
                    <span className="font-retro text-[var(--pixel-orange)] font-semibold">{project.team}</span>
                  </div>
                )}
                {project.status && (
                  <div className="flex justify-between items-center">
                    <span className="font-retro text-[var(--light-grey)]">Status:</span>
                    <span 
                      className="font-retro font-semibold uppercase"
                      style={{ color: getStatusColor(project.status) }}
                    >
                      {project.status}
                    </span>
                  </div>
                )}
              </div>
            </section>

            {/* Quick Links */}
            <section className="bg-[var(--charcoal-grey)]/30 border border-[var(--hot-pink)]/30 rounded-lg p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <ExternalLink className="w-6 h-6 text-[var(--hot-pink)]" />
                <h3 className="font-pixel text-xl text-[var(--hot-pink)]">PROJECT LINKS</h3>
              </div>
              <div className="space-y-4">
                {project.liveUrl && project.liveUrl !== '#' && (
                  <Button 
                    onClick={() => window.open(project.liveUrl, '_blank')}
                    className="w-full font-pixel text-sm bg-[var(--neon-green)]/10 text-[var(--neon-green)] border-2 border-[var(--neon-green)] px-6 py-4 hover:bg-[var(--neon-green)] hover:text-[var(--dark-navy)] transition-all duration-300 transform hover:scale-105"
                  >
                    <ExternalLink className="w-5 h-5 mr-3" />
                    VIEW LIVE DEMO
                  </Button>
                )}
                {project.githubUrl && project.githubUrl !== '#' && (
                  <Button 
                    onClick={() => window.open(project.githubUrl, '_blank')}
                    className="w-full font-pixel text-sm bg-[var(--hot-pink)]/10 text-[var(--hot-pink)] border-2 border-[var(--hot-pink)] px-6 py-4 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)] transition-all duration-300 transform hover:scale-105"
                  >
                    <Github className="w-5 h-5 mr-3" />
                    SOURCE CODE
                  </Button>
                )}
                {project.demoVideo && (
                  <Button 
                    onClick={() => window.open(project.demoVideo, '_blank')}
                    className="w-full font-pixel text-sm bg-[var(--pixel-orange)]/10 text-[var(--pixel-orange)] border-2 border-[var(--pixel-orange)] px-6 py-4 hover:bg-[var(--pixel-orange)] hover:text-[var(--dark-navy)] transition-all duration-300 transform hover:scale-105"
                  >
                    <Play className="w-5 h-5 mr-3" />
                    DEMO VIDEO
                  </Button>
                )}
                {(!project.liveUrl || project.liveUrl === '#') && (!project.githubUrl || project.githubUrl === '#') && !project.demoVideo && (
                  <div className="text-center p-4 border border-[var(--hot-pink)]/20 rounded-lg">
                    <span className="font-retro text-[var(--light-grey)] text-sm">Links will be available soon</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}