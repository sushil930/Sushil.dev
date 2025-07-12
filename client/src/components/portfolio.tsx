import { ProjectCard } from "@/lib/types";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";

const projects: ProjectCard[] = [
  {
    id: 1,
    title: "E-COMMERCE PLATFORM",
    description: "React • Redux • Stripe API",
    image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 2,
    title: "ANALYTICS DASHBOARD",
    description: "Vue.js • D3.js • Firebase",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 3,
    title: "MOBILE GAME APP",
    description: "React Native • WebGL • Node.js",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 4,
    title: "SOCIAL PLATFORM",
    description: "Next.js • GraphQL • PostgreSQL",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 5,
    title: "CRYPTO TRADER",
    description: "React • Web3.js • Solidity",
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
  {
    id: 6,
    title: "PIXEL PORTFOLIO",
    description: "HTML5 • CSS3 • JavaScript",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600",
    liveUrl: "#",
    codeUrl: "#",
  },
];

export default function Portfolio() {
  const [, navigate] = useLocation();
  
  // Fetch real projects from API
  const { data: apiProjects, isLoading } = useQuery<ProjectCard[]>({
    queryKey: ['/api/projects'],
  });

  // Combine static projects with API projects
  const allProjects = [...projects, ...(apiProjects || [])];

  const handleProjectClick = (projectId: number) => {
    navigate(`/project/${projectId}`);
  };

  return (
    <section id="portfolio" className="py-20 scanline-overlay">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-pixel text-2xl md:text-3xl text-[var(--neon-green)] mb-4">
            PROJECTS
          </h2>
          <div className="font-retro text-lg text-[var(--light-grey)]">
            Check out my latest projects
          </div>
        </div>

        {isLoading ? (
          <div className="text-center text-[var(--neon-green)] font-retro">
            LOADING PROJECTS...
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Static demo projects */}
            {projects.map((project) => (
              <div 
                key={`static-${project.id}`} 
                className="project-card cursor-pointer hover:scale-105 transition-all duration-300 group relative border-2 border-transparent hover:border-[var(--neon-green)] p-4 rounded-lg"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="mb-4 relative overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-48 object-cover rounded border-2 border-[var(--pixel-orange)] group-hover:border-[var(--neon-green)] transition-colors duration-300"
                  />
                  <div className="absolute inset-0 bg-[var(--neon-green)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded">
                    <span className="font-pixel text-[var(--neon-green)] text-sm bg-[var(--dark-navy)]/80 px-4 py-2 rounded border border-[var(--neon-green)]">
                      CLICK TO VIEW DETAILS
                    </span>
                  </div>
                </div>
                <h3 className="font-pixel text-sm text-[var(--pixel-orange)] mb-2">
                  {project.title}
                </h3>
                <p className="font-retro text-sm text-[var(--light-grey)] mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.liveUrl, '_blank');
                    }}
                    className="retro-button retro-button-outline-green glitch-hover"
                  >
                    VIEW LIVE
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(project.codeUrl, '_blank');
                    }}
                    className="retro-button font-pixel text-xs text-[var(--hot-pink)] border-2 border-[var(--hot-pink)] px-4 py-2 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)] transition-colors duration-200"
                  >
                    CODE
                  </button>
                </div>
              </div>
            ))}
            
            {/* API projects */}
            {apiProjects?.map((project) => (
              <div 
                key={`api-${project.id}`} 
                className="project-card cursor-pointer hover:scale-105 transition-transform duration-300 border-2 border-[var(--neon-green)]"
                onClick={() => handleProjectClick(project.id)}
              >
                <div className="mb-4">
                  <div className="w-full h-48 bg-gradient-to-br from-[var(--charcoal-grey)] to-[var(--dark-navy)] rounded border-2 border-[var(--neon-green)] flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-[var(--pixel-orange)] font-retro text-lg mb-2">
                        [{project.title}]
                      </div>
                      <div className="text-[var(--light-grey)] text-sm">
                        Click to view details
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="font-pixel text-sm text-[var(--neon-green)] mb-2">
                  {project.title}
                </h3>
                <p className="font-retro text-sm text-[var(--light-grey)] mb-4">
                  {project.description}
                </p>
                <div className="flex justify-between items-center">
                  {project.liveUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.liveUrl, '_blank');
                      }}
                      className="retro-button retro-button-outline-green glitch-hover"
                    >
                      VIEW LIVE
                    </button>
                  )}
                  {project.githubUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(project.githubUrl, '_blank');
                      }}
                      className="retro-button font-pixel text-xs text-[var(--hot-pink)] border-2 border-[var(--hot-pink)] px-4 py-2 hover:bg-[var(--hot-pink)] hover:text-[var(--dark-navy)] transition-colors duration-200"
                    >
                      CODE
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
